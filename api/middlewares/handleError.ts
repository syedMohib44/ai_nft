import { Request, Response, NextFunction } from 'express';
import { APIError } from '../utils/error';
import { Error as MongooseError } from 'mongoose';
import Joi from '@hapi/joi';
import { MulterError } from 'multer';

export function routeNotFoundHandler(req: Request, res: Response, next: NextFunction) {
    return res.status(404).json({
        status: 'fail',
        data: 'Requested resource not found'
    });
}

export function APIErrorHandler(err: APIError, req: Request, res: Response, next: NextFunction) {
    if (err instanceof APIError) {
        if (!err.data) {
            return res.sendStatus(err.statusCode);
        }

        return res.status(err.statusCode).json({
            status: 'fail',
            data: err.data
        });
    }

    next(err);
}

const validationErrorFn = (err: MongooseError.ValidationError, res: Response) => {
    const validationError: { message: string }[] = [];

    for (const errDetail of Object.values(err.errors)) {
        validationError.push({
            message: errDetail.message
        });
    }

    return res.status(422).json({
        status: 'fail',
        data: {
            validationError
        }
    });
};

const resourceNotFound = (err: MongooseError.CastError, res: Response) => {
    return res.status(404).json({
        status: 'fail',
        data: 'Resource not found'
    });
};

export function badDataErrorhandler(err: Joi.ValidationError, req: Request, res: Response, next: NextFunction) {
    if (err.details) {
        const validationError: { message: string }[] = [];

        for (const errDetail of err.details) {
            validationError.push({
                message: errDetail.message
            });
        }

        return res.status(422).json({
            status: 'fail',
            data: {
                validationError
            }
        });
    }

    next(err);
}

export function mongooseErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof MongooseError.ValidationError && err.name === 'ValidationError') {
        return validationErrorFn(err, res);
    }

    if (err instanceof MongooseError.CastError && err.name === 'CastError') {
        return resourceNotFound(err, res);
    }

    next(err);
}

export function multerErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof MulterError) {
        switch (err.code) {
            case 'LIMIT_FILE_SIZE': {
                return res.sendStatus(413);
            }
        }
    }

    next(err);
}

export function defaultErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.log(JSON.stringify(err, null, 2));
    return res.status(500).json({
        status: 'error',
        data: { message: 'An error occured, please try again later' }
    });
}
