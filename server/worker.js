import { Worker } from "bullmq";
import { redisConnection } from "./src/config/redis.js";


/**
    This file contains the scrape worker function that handle
    the async processing

    @author Vaibhav Sutar
    @version 1.0
 */
export const scrapeWorker = new Worker(
    "scrapeQueue",

    async (job) =>{
        console.log("processing job",job.id);
        console.log("Data",job.data);
        
        const {query,limit} = job.data;

        for (let i = 1; i <= limit; i++) {
            await new Promise((res) => setTimeout(res, 500));

            // update progress
            await job.updateProgress((i / limit) * 100);

            console.log(`Processed ${i}/${limit}`);
        }

        return { message: "Scraping completed" };
    },

    {
        connection: redisConnection,
        concurrency: 2
    }
)

scrapeWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});