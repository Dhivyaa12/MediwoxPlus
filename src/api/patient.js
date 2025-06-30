import axios from 'axios';

const BASE_URL = 'https://9dkceq681h.execute-api.ap-southeast-2.amazonaws.com/prod';

export const getPatientInfo = async (patientId) => {
  const response = await axios.get(`${BASE_URL}/patients/${patientId}`);
  return response.data;
};
