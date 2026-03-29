import {scrapeQueue} from '../../queues/scrapeQueue.js';

export const enqueueScrapeJob = async (data)=>{
    const job = await scrapeQueue.add("scrape-job",data);
    return job.id;
}