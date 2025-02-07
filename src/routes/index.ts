import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import chatbotRoutes from './chatbotRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/chatbot', chatbotRoutes);

export default router; 