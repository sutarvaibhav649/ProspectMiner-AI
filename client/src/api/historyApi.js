import API from './authApi.js';

export const fetchHistory = () => API.get('/history');

export const deleteJob = (jobId) => API.delete(`/history/${jobId}`);