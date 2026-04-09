import API from './authApi.js';

export const startScrape = (query, limit) =>
    API.post('/scrape', { query, limit });

export const getJobStatus = (jobId) =>
    API.get(`/scrape/status/${jobId}`);

export const getLeads = (jobId) =>
    API.get(`/scrape/leads/${jobId}`);