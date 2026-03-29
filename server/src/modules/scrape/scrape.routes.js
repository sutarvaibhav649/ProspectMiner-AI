import express from 'express';
import {authMiddleware} from '../../middlewares/auth.middleware.js';
import { startScrape,checkStatus } from './scrape.controller.js';

const router = express.Router();

router.post("/",authMiddleware,startScrape);
router.get("/status/:jobId", authMiddleware, checkStatus);

export default router;