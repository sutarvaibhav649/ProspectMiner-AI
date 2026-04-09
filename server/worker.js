import { Worker } from "bullmq";
import { redisConnection } from "./src/config/redis.js";
import Lead from './src/models/leads.model.js';
import Job from './src/models/job.model.js';
import connectDB from "./src/config/db.js";
import { launchBrowser } from "./src/scraper/browseManager.js";
import { scrapeGoogleMaps } from "./src/scraper/mapsScraper.js";
import { crawlWebsite } from "./src/scraper/websiteCrawler.js";
import { enrichLead } from "./src/modules/enrichment/enrichLead.js";
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });
await connectDB();

console.log("Worker started...");

export const scrapeWorker = new Worker(
    "scrapeQueue",
    async (job) => {
        console.log(`\nProcessing job ${job.id}`);
        const { query, limit, userId } = job.data;

        const browser = await launchBrowser();
        const page = await browser.newPage();

        try {
        // ── Phase 1: Scrape Google Maps ──────────────────────────────
        console.log(`\nPhase 1: Scraping Google Maps...`);
        const results = await scrapeGoogleMaps(page, query, limit);
        await page.close();

        // ── Phase 2: Enrich each lead ────────────────────────────────
        console.log(`\n Phase 2: Enriching ${results.length} leads...`);

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            console.log(`\nEnriching [${i + 1}/${results.length}]: ${result.name}`);

            // Crawl website
            let websiteText = null;
            if (result.website) {
                console.log(`Crawling: ${result.website}`);
                websiteText = await crawlWebsite(browser, result.website);
                console.log(`Text length: ${websiteText?.length || 0} chars`);
            } else {
                console.log(`No website — skipping crawl`);
            }

            // LLM enrichment
            console.log(`Calling LLM...`);
            const enriched = await enrichLead(result, websiteText);
            console.log(`Score: ${enriched.score} | Services: ${enriched.services || 'N/A'}`);
            await new Promise(res => setTimeout(res, 15000));

            console.log(`Saving:`, {
                score: enriched.score,
                services: enriched.services,
                emailPattern: enriched.emailPattern
            });

            // Save lead to DB
            await Lead.create({
                jobId: job.id,
                name: result.name,
                rating: result.rating,
                reviewCount: result.reviewCount,
                phone: result.phone,
                website: result.website,
                address: result.address,
                category: result.category,
                services: enriched.services,        // ← check this exists
                ownerName: enriched.ownerName,      // ← check this exists
                emailPattern: enriched.emailPattern, // ← check this exists
                score: enriched.score,              // ← check this exists
                scoreReason: enriched.scoreReason,  // ← check this exists
                status: 'processed'
                });

                // Update progress
                await job.updateProgress(((i + 1) / results.length) * 100);
            }

        // ── Phase 3: Save Job record ─────────────────────────────────
                await Job.create({
                    jobId: job.id,
                    userId,
                    query,
                    limit,
                    totalLeads: results.length,
                    status: 'completed'
                });

            console.log(`\nJob ${job.id} complete — ${results.length} leads saved`);
            return { message: "Scraping and enrichment completed", total: results.length };

        } catch (err) {
            console.log(`Job ${job.id} failed: ${err.message}`);
            throw err;
        } finally {
            await browser.close();
        }
    },
    {
        connection: redisConnection,
        concurrency: 2
    }
);

scrapeWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed successfully`);
});

scrapeWorker.on("failed", (job, err) => {
    console.log(`Job ${job.id} failed: ${err.message}`);
});