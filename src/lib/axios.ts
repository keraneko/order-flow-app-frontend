import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost',
  //   timeout: 1000,
  headers: { Accept: 'application/json' },
  withCredentials: true,
  withXSRFToken: true,
});
