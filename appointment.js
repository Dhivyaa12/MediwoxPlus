import axios from 'axios';

const BASE_URL = 'https://9dkceq681h.execute-api.ap-southeast-2.amazonaws.com/prod';

export const bookAppointment = async (patientId, appointmentDetails) => {
  return axios.post(`${BASE_URL}/appointment/${patientId}`, appointmentDetails);
};

export const getAppointmentsByPatient = async (patientId) => {
  return axios.get(`${BASE_URL}/appointment/${patientId}`);
};
