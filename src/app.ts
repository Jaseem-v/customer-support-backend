import express, { Request, Response } from "express";
import cors from "cors";
import routes from "./routes"
import globalErrorHandler, { sendErrorDev } from "./controller/error/errorController"
import AppError from "./utils/errorHandler";

const app = express()

app.use(cors());

const dotenv = require('dotenv');
// import { env } from 'node:process';

// console.log(env);
dotenv.config({ path: '.env' });


app.use(express.json())

app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
});

app.get("/", (req: Request, res: Response) => {
    res.send('<h1> hi </h1>')
})

app.use("/api/v1", routes)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);




export default app
