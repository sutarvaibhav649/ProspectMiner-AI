import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { getSummary } from './analytics.controller.js';

const router = express.Router();

router.get('/summary', authMiddleware, getSummary);

export default router;