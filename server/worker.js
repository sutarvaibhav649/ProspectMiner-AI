import { Worker } from "bullmq";
import { redisConnection } from "./src/config/redis.js";
import Lead from './src/models/leads.model.js';
import connectDB from "./src/config/db.js";
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

        for (let i = 1; i <= limit; i++) {
            await new Promise((res) => setTimeout(res, 500));

            // 🔥 Dummy lead (later replace with Puppeteer)
            const lead = {
                jobId: job.id,
                name: `Business ${i}`,
                address: "Pune",
                phone: "1234567890",
                website: "example.com",
                rating: Math.random() * 5
            };

            await Lead.create(lead);

            await job.updateProgress((i / limit) * 100);

            console.log(`Saved lead ${i}`);
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