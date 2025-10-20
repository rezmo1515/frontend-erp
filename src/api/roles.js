import client from './client.js';

export async function fetchRoles() {
  const { data } = await client.get('/roles');
  return data?.data || [];
}

export async function createRole(payload) {
  const { data } = await client.post('/roles', payload);
  return data?.data;
}

export async function updateRole(id, payload) {
  const { data } = await client.put(`/roles/${id}`, payload);
  return data?.data;
}

export async function deleteRole(id) {
  const { data } = await client.delete(`/roles/${id}`);
  return data?.data;
}

export async function assignRoleToEmployee(employeeId, payload) {
  const { data } = await client.post(`/employees/${employeeId}/roles`, payload);
  return data?.data;
}
