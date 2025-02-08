"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessage = void 0;
const chatbotResponses_1 = require("../utils/chatbotResponses");
const uuid_1 = require("uuid");
const handleMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({
                status: 'error',
                message: 'Message is required'
            });
        }
        // Create user message
        const userMessage = {
            id: (0, uuid_1.v4)(),
            text: message,
            sender: 'user',
            timestamp: new Date()
        };
        // Get bot response
        const botResponse = (0, chatbotResponses_1.getBotResponse)(message);
        // Create bot message
        const botMessage = {
            id: (0, uuid_1.v4)(),
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
    }
    catch (error) {
        next(error);
    }
};
exports.handleMessage = handleMessage;
