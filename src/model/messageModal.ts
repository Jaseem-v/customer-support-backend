import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    sessionId: string;
    sender: string;
    message: string;
    timestamp: Date;
}

const messageSchema: Schema = new Schema({
    sessionId: { type: String, required: true },
    sender: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);
