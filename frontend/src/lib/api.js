// Thin client for the FutureMinds backend. Same-origin by default (/api/...);
// set VITE_API_URL only if the API is hosted on a different origin.
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'futureminds_token_v1';
const CMS_TOKEN_KEY = 'futureminds_cms_token_v1';

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const getCmsToken = () => {
  try { return sessionStorage.getItem(CMS_TOKEN_KEY); } catch { return null; }
};
export const setCmsToken = (token) => {
  try {
    if (token) sessionStorage.setItem(CMS_TOKEN_KEY, token);
    else sessionStorage.removeItem(CMS_TOKEN_KEY);
  } catch { /* storage unavailable */ }
};
export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setCmsToken(null);
    }
  } catch { /* storage unavailable */ }
};

/** Uploaded files are stored as /api/media/<id>.mp4; make them absolute if the API is on another origin. */
export const resolveMediaUrl = (url) => (typeof url === 'string' && url.startsWith('/api/') ? BASE + url : url);

export class ApiError extends Error {
  constructor(status, message, code = null) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request(method, path, { json, headers: extraHeaders } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json !== undefined) headers['Content-Type'] = 'application/json';
  if (extraHeaders) Object.assign(headers, extraHeaders);
  let res;
  try {
    res = await fetch(BASE + path, { method, headers, body: json !== undefined ? JSON.stringify(json) : undefined });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check your connection and try again.');
  }
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) throw new ApiError(res.status, data?.error || `Request failed (${res.status})`, data?.code || null);
  return data;
}

/** Multipart upload with progress (fetch cannot report upload progress, XHR can). */
function upload(path, file, onProgress, extraHeaders) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', BASE + path);
    const token = getToken();
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    if (extraHeaders) {
      for (const [k, v] of Object.entries(extraHeaders)) {
        xhr.setRequestHeader(k, v);
      }
    }
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(new ApiError(0, 'Upload failed. Check your connection and try again.'));
    xhr.onload = () => {
      let data = null;
      try { data = JSON.parse(xhr.responseText); } catch { /* ignore */ }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new ApiError(xhr.status, data?.error || `Upload failed (${xhr.status})`, data?.code || null));
    };
    const form = new FormData();
    form.append('file', file);
    xhr.send(form);
  });
}

export const api = {
  login: (email, password, role) => request('POST', '/api/auth/login', { json: { email, password, role } }),
  me: () => request('GET', '/api/auth/me'),
  getCourse: () => request('GET', '/api/course'),
  saveCourse: (tree) => {
    const cmsToken = getCmsToken();
    return request('PUT', '/api/course', {
      json: tree,
      headers: cmsToken ? { 'X-CMS-Token': cmsToken } : undefined,
    });
  },
  resetCourse: () => {
    const cmsToken = getCmsToken();
    return request('POST', '/api/course/reset', {
      headers: cmsToken ? { 'X-CMS-Token': cmsToken } : undefined,
    });
  },
  uploadFile: (file, onProgress) => {
    const cmsToken = getCmsToken();
    return upload('/api/uploads', file, onProgress, cmsToken ? { 'X-CMS-Token': cmsToken } : undefined);
  },
  cmsUnlock: (password) => request('POST', '/api/cms/unlock', { json: { password } }),
  cmsStatus: () => {
    const cmsToken = getCmsToken();
    return request('GET', '/api/cms/status', {
      headers: cmsToken ? { 'X-CMS-Token': cmsToken } : undefined,
    });
  },
  tutorChat: (payload) => request('POST', '/api/tutor/chat', { json: payload }),
  tutorSessions: () => request('GET', '/api/tutor/sessions'),
  tutorMessages: (id) => request('GET', `/api/tutor/sessions/${encodeURIComponent(id)}/messages`),
  tutorDeleteSession: (id) => request('DELETE', `/api/tutor/sessions/${encodeURIComponent(id)}`),
};
