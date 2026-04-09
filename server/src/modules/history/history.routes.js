import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { getHistory, deleteJob } from './history.controller.js';

const router = express.Router();

router.get('/', authMiddleware, getHistory);
router.delete('/:jobId', authMiddleware, deleteJob);

export default router;