import API from './authApi.js';

export const fetchAnalytics = () => API.get('/analytics/summary');