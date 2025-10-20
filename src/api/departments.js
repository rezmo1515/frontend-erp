import client from './client.js';

export async function fetchDepartments() {
  const { data } = await client.get('/departments');
  return data?.data || [];
}

export async function createDepartment(payload) {
  const { data } = await client.post('/departments', payload);
  return data?.data;
}

export async function updateDepartment(id, payload) {
  const { data } = await client.put(`/departments/${id}`, payload);
  return data?.data;
}

export async function deleteDepartment(id) {
  const { data } = await client.delete(`/departments/${id}`);
  return data?.data;
}
