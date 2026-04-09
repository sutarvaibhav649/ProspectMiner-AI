import {scrapeQueue} from '../../queues/scrapeQueue.js';
import Lead from '../../models/leads.model.js';

import Job from '../../models/job.model.js';



export const enqueueScrapeJob = async (data)=>{
    const job = await scrapeQueue.add("scrape-job",data);
    return job.id;
}

export const getJobStatus = async (jobId) => {
    const job = await scrapeQueue.getJob(jobId);
    if (!job) throw new Error('Job not found');

    // Also fetch job record from DB for query/limit info
    const jobRecord = await Job.findOne({ jobId });

    return {
        status: await job.getState(),
        progress: job.progress,
        query: jobRecord?.query || null,
        limit: jobRecord?.limit || null,
        timestamp: jobRecord?.createdAt || null,
    };
};

export const getLeadsByJobId = async (jobId) => {
    return await Lead.find({ jobId });
};