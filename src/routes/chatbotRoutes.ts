import express from 'express';
import { handleMessage } from '../controllers/chatbotController';

const router = express.Router();

router.post('/message', handleMessage);

export default router; 