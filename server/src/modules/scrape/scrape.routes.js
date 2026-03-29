import express from 'express';
import {authMiddleware} from '../../middlewares/auth.middleware.js';
import { startScrape,checkStatus,getLeads } from './scrape.controller.js';

const router = express.Router();

router.post("/",authMiddleware,startScrape);
router.get("/status/:jobId", authMiddleware, checkStatus);
router.get("/leads/:jobId", authMiddleware, getLeads);

export default router;