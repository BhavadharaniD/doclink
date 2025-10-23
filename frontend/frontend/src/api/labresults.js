import axios from 'axios';

const BASE_URL = '/api/labresults';

export const getLabResultsByPatient = async (patientId) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/patient/${patientId}`);
    return data;
  } catch (error) {
    console.error('Error fetching lab results:', error);
    throw error;
  }
};
