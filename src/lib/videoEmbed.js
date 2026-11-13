import { resolveMediaUrl } from './api.js';

/**
 * Turn a YouTube / Vimeo / Google Drive / direct media URL into something
 * a <video> or <iframe> can play.
 */
export function resolveVideoEmbed(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const url = rawUrl.trim();

  // Videos uploaded through the CMS live in the bucket and are served via /api/media/<id>.mp4
  if (url.startsWith('/api/media/')) {
    return { kind: 'video', src: resolveMediaUrl(url) };
  }

  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (youtube) {
    return { kind: 'iframe', src: `https://www.youtube.com/embed/${youtube[1]}` };
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}` };
  }

  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  if (url.includes('drive.google.com') && drive) {
    return { kind: 'iframe', src: `https://drive.google.com/file/d/${drive[1]}/preview` };
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
    return { kind: 'video', src: url };
  }

  return { kind: 'iframe', src: url };
}
