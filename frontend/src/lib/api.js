// Thin client for the FutureMinds backend. Same-origin by default (/api/...);
// set VITE_API_URL only if the API is hosted on a different origin.
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'futureminds_token_v1';

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* storage unavailable */ }
};

/** Uploaded files are stored as /api/media/<id>.mp4; make them absolute if the API is on another origin. */
export const resolveMediaUrl = (url) => (typeof url === 'string' && url.startsWith('/api/') ? BASE + url : url);

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(method, path, { json } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json !== undefined) headers['Content-Type'] = 'application/json';
  let res;
  try {
    res = await fetch(BASE + path, { method, headers, body: json !== undefined ? JSON.stringify(json) : undefined });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check your connection and try again.');
  }
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) throw new ApiError(res.status, data?.error || `Request failed (${res.status})`);
  return data;
}

/** Multipart upload with progress (fetch cannot report upload progress, XHR can). */
function upload(path, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', BASE + path);
    const token = getToken();
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(new ApiError(0, 'Upload failed. Check your connection and try again.'));
    xhr.onload = () => {
      let data = null;
      try { data = JSON.parse(xhr.responseText); } catch { /* ignore */ }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new ApiError(xhr.status, data?.error || `Upload failed (${xhr.status})`));
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
  saveCourse: (tree) => request('PUT', '/api/course', { json: tree }),
  resetCourse: () => request('POST', '/api/course/reset'),
  uploadFile: (file, onProgress) => upload('/api/uploads', file, onProgress),
  tutorChat: (payload) => request('POST', '/api/tutor/chat', { json: payload }),
  tutorSessions: () => request('GET', '/api/tutor/sessions'),
  tutorMessages: (id) => request('GET', `/api/tutor/sessions/${encodeURIComponent(id)}/messages`),
  tutorDeleteSession: (id) => request('DELETE', `/api/tutor/sessions/${encodeURIComponent(id)}`),
};
