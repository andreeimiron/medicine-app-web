import { sendRequest } from "../../../utils/api";

export const create = (data) => sendRequest('POST', '/history', data);

export const getAllByUser = async (data) => {
  const { page = 1, limit = 5, userId } = data;
  return await sendRequest('GET', `/history?page=${page}&limit=${limit}&userId=${userId}`, data);
}

export const getAllByDoctor = async (data) => {
  const { page = 1, limit = 5, doctorId } = data;
  return await sendRequest('GET', `/history?page=${page}&limit=${limit}&doctorId=${doctorId}`, data);
}

export const getById = (id) => sendRequest('GET', `/history/${id}`, null);
