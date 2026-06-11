const API_BASE_URL =
  'http://localhost:8080/api';

function buildUrl(path = '') {
  const p = String(path || '').trim();
  if (!p) return API_BASE_URL;
  const normalizedBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const normalizedPath = p.startsWith('/') ? p : `/${p}`;
  return `${normalizedBase}${normalizedPath}`;
}

async function request(method, path, body) {
  const res = await fetch(buildUrl(path), {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : null),
  });

  const text = await res.text();
  const data = text
    ? (() => {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      })()
    : null;

  if (!res.ok) {
    const err = new Error(typeof data === 'string' ? data : data?.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const apiClient = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
};

export { buildUrl };
