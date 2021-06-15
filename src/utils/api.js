import axios from 'axios';
import { API_URL } from '../config';

const getHeaders = async () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = await localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};


export const sendRequest = async (method, endpoint, data) => {
  const headers = await getHeaders();
  const url = `${API_URL}${endpoint}`;
  const config = {
    method,
    url,
    data,
    headers,
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        const { response: { data } = {} } = error;

        reject(data ? data.message : 'Ceva nu a functionat');
      });
  });
};
