import api from './apiClient.js';

export async function getDriver(id) {
  const { data } = await api.get(`/drivers/${id}`);
  return data?.driver || null;
}

export async function getDriverFeedback(id) {
  const { data } = await api.get(`/feedback/driver/${id}`);
  return data?.items || [];
}

export async function getDriverAlerts(id) {
  const { data } = await api.get(`/alerts/driver/${id}`);
  return data?.items || [];
}

export async function getDriverTimeseries(id, days = 30) {
  const { data } = await api.get(`/analytics/driver/${id}/timeseries?days=${days}`);
  return data?.items || [];
}

export async function searchDrivers(q) {
  const { data } = await api.get('/drivers/search', { params: { q } });
  return data?.items || [];
}

// optional: list with pagination
export async function listDrivers(page = 1, limit = 20) {
  const { data } = await api.get('/drivers', { params: { page, limit } });
  return data;
}