import express from 'express';
import { scrapeWorker } from './worker.js';
import dotenv from 'dotenv'
import { globalErrorHandler } from './src/middlewares/error.middleware.js';
import authRoutes from './src/modules/auth/auth.routes.js';
import creditsRoutes from './src/modules/credit/credit.route.js';
import scrapeRoutes from './src/modules/scrape/scrape.routes.js';
import historyRoutes from './src/modules/history/history.routes.js';
/**
    This file contains configurations to start the express app

    @author Vaibhav Sutar
    @version 1.0
 */

dotenv.config({
    path: "./.env"
})

const app = express();
app.use(express.json());


scrapeWorker

// Routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/credits",creditsRoutes);
app.use("/api/v1/scrape",scrapeRoutes);
app.use('/api/v1/history', historyRoutes);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

