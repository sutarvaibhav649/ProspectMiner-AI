import API from './authApi.js';

export const fetchBalance = () => API.get('/credits/balance');