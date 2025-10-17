import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const pingBackend = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/test/ping`);
    return response.data;
  } catch (error) {
    console.error('Ping failed:', error);
    return null;
  }
};