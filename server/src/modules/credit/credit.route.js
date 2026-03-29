import { balance } from "./credit.controller.js";
import {authMiddleware} from '../../middlewares/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.get("/balance",authMiddleware,balance);

export default router;