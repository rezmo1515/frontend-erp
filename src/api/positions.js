import client from './client.js';

export async function fetchPositions() {
  const { data } = await client.get('/positions');
  return data?.data || [];
}

export async function createPosition(payload) {
  const { data } = await client.post('/positions', payload);
  return data?.data;
}

export async function updatePosition(id, payload) {
  const { data } = await client.put(`/positions/${id}`, payload);
  return data?.data;
}

export async function deletePosition(id) {
  const { data } = await client.delete(`/positions/${id}`);
  return data?.data;
}
