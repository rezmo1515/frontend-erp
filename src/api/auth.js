import client from './client.js';

export async function loginRequest(credentials) {
  const { data } = await client.post('/login', credentials);
  if (!data?.data?.token) {
    throw new Error('Invalid login response received from server');
  }
  return {
    token: data.data.token,
    user: data.data.user
  };
}

export async function logoutRequest() {
  await client.post('/logout');
}
