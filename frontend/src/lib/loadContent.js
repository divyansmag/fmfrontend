/**
 * Build-time content discovery.
 * Vite picks up every content folder manifest.json — new files appear automatically.
 */

const manifestModules = import.meta.glob('/content/**/manifest.json', {
  eager: true,
  import: 'default',
});

function posixPath(value) {
  return String(value).replace(/\\/g, '/');
}

function folderFromManifestPath(manifestPath) {
  const normalized = posixPath(manifestPath);
  return normalized.replace(/\/manifest\.json$/i, '');
}

function publicBaseFromFolder(folderPath) {
  const marker = '/content/';
  const idx = folderPath.lastIndexOf(marker);
  if (idx === -1) return '/content';
  return folderPath.slice(idx);
}

function isValidManifest(raw) {
  return Boolean(
    raw &&
      typeof raw === 'object' &&
      typeof raw.id === 'string' &&
      raw.id.trim() &&
      typeof raw.type === 'string' &&
      raw.type.trim() &&
      typeof raw.title === 'string' &&
      raw.title.trim() &&
      raw.data &&
      typeof raw.data === 'object'
  );
}

function enrich(raw, folderPath) {
  const publicBase = publicBaseFromFolder(folderPath);
  return {
    ...raw,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    description: raw.description || '',
    dateAdded: raw.dateAdded || '',
    _folder: folderPath,
    _publicBase: publicBase,
  };
}

export function resolveContentAsset(manifest, relativePath) {
  if (!relativePath) return '';
  if (/^(https?:)?\/\//i.test(relativePath) || relativePath.startsWith('data:')) {
    return relativePath;
  }
  const base = manifest?._publicBase || '/content';
  const cleaned = String(relativePath).replace(/^\.\//, '').replace(/^\/+/, '');
  return `${base.replace(/\/$/, '')}/${cleaned}`;
}

const allContent = Object.entries(manifestModules)
  .map(([filePath, raw]) => {
    if (!isValidManifest(raw)) {
      console.warn(`[loadContent] Skipping invalid manifest: ${filePath}`);
      return null;
    }
    return enrich(raw, folderFromManifestPath(filePath));
  })
  .filter(Boolean)
  .sort((a, b) => String(b.dateAdded).localeCompare(String(a.dateAdded)) || a.title.localeCompare(b.title));

export function getAllContent() {
  return allContent;
}

export function getContentByType(type) {
  return allContent.filter((item) => item.type === type);
}

export function getContentById(id) {
  return allContent.find((item) => item.id === id) || null;
}

export function getContentTags() {
  return [...new Set(allContent.flatMap((item) => item.tags))].sort();
}

export function getContentTypes() {
  return [...new Set(allContent.map((item) => item.type))];
}
