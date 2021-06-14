import { sendRequest } from "../../../utils/api";

export const create = (data) => sendRequest('POST', '/user/register', data);

export const getAllByDoctor = async (data) => {
  const { page = 1, limit = 5, doctorId } = data;
  return await sendRequest('GET', `/user?page=${page}&limit=${limit}&doctorId=${doctorId}`, data);
}

export const getAll = async (data) => {
  const { page = 1, limit = 1000 } = data;
  return await sendRequest('GET', `/user?page=${page}&limit=${limit}`, data);
}

export const getById = (id) => sendRequest('GET', `/user/${id}`, null);

export const update = async (data) => {
  const { id } = data;
  return await sendRequest('PUT', `/user/${id}`, data);
}

export const search = (searchTerm) => sendRequest('GET', `/user/search/${searchTerm}`, null);
