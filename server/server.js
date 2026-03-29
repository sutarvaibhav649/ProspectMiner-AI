import express from 'express';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv'
import { globalErrorHandler } from './src/middlewares/error.middleware.js';
import authRoutes from './src/modules/auth/auth.routes.js';
import creditsRoutes from './src/modules/credit/credit.route.js';

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

// connect the DB
connectDB();

// Routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/credits",creditsRoutes);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

