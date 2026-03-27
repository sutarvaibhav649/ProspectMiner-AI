import express from 'express';
import { register,login } from './auth.controller.js';

const router = express.Router();

router.post("/user",register);
router.post("/login",login);

export default router;