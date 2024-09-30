import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt"
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/errorHandler";
import jwt from "jsonwebtoken"
import clinicSchema from "../../model/userModal";
import { requestWithUser } from "../../types/types";


// const AppError = require("../utils/errorHandler");


export const userLogin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body

        const user = await clinicSchema.findOne({
            email
        })

        if (!user) {
            return next(new AppError('User not found !', 404))
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return next(new AppError('Incorrect password', 401))
        }

        const token = jwt.sign({ userId: user._id, role: "SUPER_ADMIN" }, process.env.SECRET_KEY, {
            expiresIn: '30d'
        });

        user.password = undefined

        res.cookie('authToken', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict', 
            maxAge: 60 * 60 * 1000, 
        });

        res.status(200).send({
            message: "user found",
            user: user
        })
    }
)

export const getUserProfile = catchAsync(
    async (req: requestWithUser, res: Response, next: NextFunction) => {
        res.status(200).send({
            message: "user details fetched ",
            user: req.user,
            role: req.role
        })
    }
)