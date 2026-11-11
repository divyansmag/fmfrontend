import fs from 'node:fs';
import path from 'node:path';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from './config.js';
import { httpError } from './errors.js';

/** Counts bytes and aborts the upload with a 413 once the limit is passed. */
export function sizeLimiter(maxBytes) {
  let bytes = 0;
  const t = new Transform({
    transform(chunk, _enc, cb) {
      bytes += chunk.length;
      if (bytes > maxBytes) return cb(httpError(413, `File too large (max ${Math.round(maxBytes / 1048576)} MB)`));
      cb(null, chunk);
    },
  });
  Object.defineProperty(t, 'bytes', { get: () => bytes });
  return t;
}

function s3Driver() {
  const { bucket, endpoint, region, accessKeyId, secretAccessKey, forcePathStyle } = config.s3;
  const client = new S3Client({
    region,
    endpoint,
    forcePathStyle,
    credentials: { accessKeyId, secretAccessKey },
  });
  return {
    kind: 's3',
    async put(key, body, contentType) {
      const upload = new Upload({
        client,
        params: { Bucket: bucket, Key: key, Body: body, ContentType: contentType },
        queueSize: 3,
        partSize: 8 * 1024 * 1024,
      });
      await upload.done();
    },
    async remove(key) {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    },
    // The browser is redirected here; the bucket serves the bytes (and handles Range requests for video seeking).
    async signedUrl(key) {
      return getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 3600 });
    },
  };
}

function localDriver() {
  const dir = config.uploadsDir;
  const file = (key) => path.join(dir, path.basename(key));
  return {
    kind: 'local',
    async put(key, body) {
      fs.mkdirSync(dir, { recursive: true });
      await pipeline(body, fs.createWriteStream(file(key)));
    },
    async remove(key) {
      await fs.promises.rm(file(key), { force: true });
    },
    localPath: file,
  };
}

export const storage = config.s3.bucket ? s3Driver() : localDriver();
console.log(`[storage] using ${storage.kind} storage`);
