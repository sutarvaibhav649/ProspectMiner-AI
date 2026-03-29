import {scrapeQueue} from '../../queues/scrapeQueue.js';

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