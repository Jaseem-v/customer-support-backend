import { Request, Response } from 'express';
import { Message, IMessage } from '../../model/messageModal';

// Save message to the database
export const saveMessage = async (sessionId: string, sender: string, message: string) => {
    const newMessage = new Message({ sessionId, sender, message });
    await newMessage.save();
};

// Fetch chat history for a session
export const getChatHistory = async (sessionId: string): Promise<IMessage[]> => {
    return await Message.find({ sessionId }).sort({ timestamp: 1 }).exec();
};
