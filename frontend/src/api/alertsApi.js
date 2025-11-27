import api from './apiClient.js';

// Alerts
export async function fetchRecentAlerts({ limit = 50, driverId = '' } = {}) {
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (driverId) params.set('driverId', driverId);
  const { data } = await api.get(`/alerts/recent?${params.toString()}`);
  return data;
}

export async function fetchAlertLocks(driverId = '') {
  const qs = driverId ? `?driverId=${encodeURIComponent(driverId)}` : '';
  const { data } = await api.get(`/alerts/locks${qs}`);
  return data;
}

export async function muteDriverAlerts(driverId, minutes = 60) {
  const { data } = await api.post(`/alerts/mute/${driverId}?minutes=${minutes}`);
  return data;
}

export async function unmuteDriverAlerts(driverId) {
  const { data } = await api.delete(`/alerts/mute/${driverId}`);
  return data;
}

export async function fetchDriverAlerts(driverId, { limit = 5 } = {}) {
  const { data } = await api.get(`/alerts/driver/${driverId}`);
  const items = Array.isArray(data?.items) ? data.items : [];
  return items.slice(0, limit);
}


// Worker
export async function getWorkerStatus() {
  const { data } = await api.get('/worker/status');
  return data;
}
export async function workerRunOnce() {
  const { data } = await api.post('/worker/run-once');
  return data;
}
export async function workerPause() {
  const { data } = await api.post('/worker/pause');
  return data;
}
export async function workerResume() {
  const { data } = await api.post('/worker/resume');
  return data;
}
