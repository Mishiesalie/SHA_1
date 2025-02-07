import { Request, Response, NextFunction } from 'express';
import { ChatMessage } from '../models/ChatMessage';
import { getBotResponse } from '../utils/chatbotResponses';
import { v4 as uuidv4 } from 'uuid';

export const handleMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({
                status: 'error',
                message: 'Message is required'
            });
        }

        // Create user message
        const userMessage: ChatMessage = {
            id: uuidv4(),
            text: message,
            sender: 'user',
            timestamp: new Date()
        };

        // Get bot response
        const botResponse = getBotResponse(message);
        
        // Create bot message
        const botMessage: ChatMessage = {
            id: uuidv4(),
            text: botResponse,
            sender: 'bot',
            timestamp: new Date()
        };

        res.status(200).json({
            status: 'success',
            data: {
                userMessage,
                botMessage
            }
        });
    } catch (error) {
        next(error);
    }
}; 