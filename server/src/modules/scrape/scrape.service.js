import {scrapeQueue} from '../../queues/scrapeQueue.js';
import Lead from '../../models/leads.model.js';
export const enqueueScrapeJob = async (data)=>{
    const job = await scrapeQueue.add("scrape-job",data);
    return job.id;
}

export const getJobStatus = async (jobId)=>{
    const job = await scrapeQueue.getJob(jobId);

    if (!job) {
        throw new Error("Job not found");
    }

    return {
        status: await job.getState(),
        progress: job.progress
    };
}

export const getLeadsByJobId = async (jobId) => {
    return await Lead.find({ jobId });
};