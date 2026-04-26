const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function authHeaders() {
  const token = sessionStorage.getItem('admin_token');
  return { Authorization: `Bearer ${token}` };
}

async function req(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// ─── Wishes ──────────────────────────────────────────────────────────────────
export const wishesApi = {
  create: (formData) =>
    req('/api/wishes', { method: 'POST', headers: authHeaders(), body: formData }),

  list: (status) =>
    req(`/api/wishes${status ? `?status=${status}` : ''}`, { headers: authHeaders() }),

  today: () =>
    req('/api/wishes/today', { headers: authHeaders() }),

  upcoming: () =>
    req('/api/wishes/upcoming', { headers: authHeaders() }),

  markSent: (id) =>
    req(`/api/wishes/${id}/mark-sent`, { method: 'PUT', headers: authHeaders() }),

  delete: (id) =>
    req(`/api/wishes/${id}`, { method: 'DELETE', headers: authHeaders() }),
};

// ─── Albums ──────────────────────────────────────────────────────────────────
export const albumsApi = {
  list: () => req('/api/albums'),

  create: (body) =>
    req('/api/admin/albums', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  delete: (id) =>
    req(`/api/admin/albums/${id}`, { method: 'DELETE', headers: authHeaders() }),

  listPhotos: (albumId) => req(`/api/albums/${albumId}/photos`),

  uploadPhoto: (albumId, formData) =>
    req(`/api/admin/albums/${albumId}/photos`, {
      method: 'POST',
      headers: authHeaders(),
      body: formData,
    }),

  deletePhoto: (albumId, photoId) =>
    req(`/api/admin/albums/${albumId}/photos/${photoId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }),
};

// ─── Services ────────────────────────────────────────────────────────────────
export const servicesApi = {
  list: () => req('/api/services'),
};
