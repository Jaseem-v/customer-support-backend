import { Request, Response, NextFunction, Errback } from "express";

export const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};


const globalErrorHandler = (err, req: Request, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
    // }
    // else if (process.env.NODE_ENV === 'production') {
    //     let error = { ...err };

    //     if (error.name === 'CastError') error = handleCastErrorDB(error);
    //     if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    //     if (error.name === 'ValidationError')
    //         error = handleValidationErrorDB(error);

    //     sendErrorProd(error, res);
    // }
};

export default globalErrorHandler