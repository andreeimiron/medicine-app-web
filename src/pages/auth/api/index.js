import { sendRequest } from "../../../utils/api";

export const login = (data) => sendRequest('POST', '/user/login', data);

export const register = (data) => sendRequest('POST', '/user/register', data);
