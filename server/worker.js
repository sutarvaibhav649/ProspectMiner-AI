import { Worker } from "bullmq";
import { redisConnection } from "./src/config/redis.js";
import Lead from './src/models/leads.model.js';
import connectDB from "./src/config/db.js";
import { launchBrowser } from "./src/scraper/browseManager.js";
import { scrapeGoogleMaps } from "./src/scraper/mapsScraper.js";

import dotenv from 'dotenv'; 
/**
    This file contains the scrape worker function that handle
    the async processing

    @author Vaibhav Sutar
    @version 1.0
 */


dotenv.config({
    path: "./.env"
})
// connect the DB
await connectDB();

console.log("Worker started...");
export const scrapeWorker = new Worker(
    "scrapeQueue",

    async (job) =>{
        console.log("processing job",job.id);
        console.log("Data",job.data);
        
        const {query,limit} = job.data;

        const browser = await launchBrowser();
        const page = await browser.newPage();

        const results = await scrapeGoogleMaps(page, query, limit);

        for (let i = 0; i < results.length; i++) {
            const lead = {
                jobId: job.id,
                name: results[i].name,
                rating: results[i].rating
            };

            await Lead.create(lead);

            await job.updateProgress(((i + 1) / results.length) * 100);
        }

        await browser.close();

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