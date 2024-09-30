import { Request, Response } from "express";
import app from "./app"
import mongoose, { ConnectOptions } from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketService } from "./socket/chatSocket";
// import dotenv from "dotenv";



const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

console.log(DB);



mongoose.connect(DB,
    {
        dbName: "chatapp"
    }
).then(() => {
    console.log("DB connected ✅")
}).catch((error) => {
    console.log("error", error);

})

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io server
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust for production
        methods: ["GET", "POST"]
    }
});

// Initialize socket service (where your socket logic lives)
socketService(io);



const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});