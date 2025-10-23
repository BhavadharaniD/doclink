import axios from 'axios';

const BASE_URL = '/api/users';

export const getActivePatients = async (doctorId) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/doctor/${doctorId}/active`);
    return data;
  } catch (error) {
    console.error('Error fetching active patients:', error);
    throw error;
  }
};
