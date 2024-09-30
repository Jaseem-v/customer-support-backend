import { Server, Socket } from 'socket.io';
import { saveMessage, getChatHistory } from '../controller/chat/chatController';

interface ChatSession {
    customer: string | null;
    rep: string | null;
    repName: string | null;
}

const activeChats: { [key: string]: ChatSession } = {};
const activeCustomers: { [key: string]: string } = {};

export const socketService = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('A user connected', socket.id);

        socket.on('join_chat', async (sessionId: string) => {
            socket.join(sessionId);

            if (!activeChats[sessionId]) {
                activeChats[sessionId] = { customer: socket.id, rep: null, repName: null };
            }

            activeCustomers[sessionId] = socket.id;

            // Fetch and send chat history
            const chatHistory = await getChatHistory(sessionId);
            socket.emit('chat_history', chatHistory);

            console.log(`Customer ${socket.id} joined session: ${sessionId}`);
        });

        socket.on('rep_join_chat', ({ sessionId, repName }: { sessionId: string, repName: string }) => {
            const session = activeChats[sessionId];

            if (!session || session.rep) {
                socket.emit('error_message', 'This chat is already being handled by another representative or no customer exists.');
                return;
            }

            session.rep = socket.id;
            session.repName = repName;
            socket.join(sessionId);

            io.to(session.customer!).emit('rep_joined', { repName });
            console.log(`${repName} joined session: ${sessionId}`);
        });

        socket.on('send_message', async ({ sessionId, message, sender }: { sessionId: string, message: string, sender: string }) => {
            const chatMessage = { sender, message, timestamp: new Date() };
            await saveMessage(sessionId, sender, message);

            io.to(sessionId).emit('receive_message', chatMessage);
        });

        socket.on('typing', ({ sessionId, sender }: { sessionId: string, sender: string }) => {
            socket.to(sessionId).emit('typing', sender);
        });

        socket.on('disconnect', () => {
            Object.keys(activeChats).forEach(sessionId => {
                const session = activeChats[sessionId];

                if (session.customer === socket.id) {
                    delete activeChats[sessionId];
                    delete activeCustomers[sessionId];
                    io.to(session.rep!).emit('customer_left', 'The customer has left the chat.');
                }

                if (session.rep === socket.id) {
                    session.rep = null;
                    session.repName = null;
                    io.to(session.customer!).emit('rep_left', 'The representative has left the chat.');
                }
            });

            console.log('User disconnected', socket.id);
        });
    });
};
