import { NextFunction, Response } from "express";
import { requestWithUser } from "../types/types";
import catchAsync from "../utils/catchAsync";
import userSchema from "../model/userModal";
import jwt from "jsonwebtoken"


const authenticate = catchAsync(async (req: requestWithUser, res: Response, next: NextFunction) => {
    const token = (req.headers as any).authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const user = await userSchema.findById((decodedToken as any).userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = undefined


        req.user = user;
        req.role = (decodedToken as any).role;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

export default authenticate