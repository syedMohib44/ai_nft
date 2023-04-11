import { Request, Response, NextFunction } from 'express';
import { IUserRequest } from '../interface/IUserRequest';

type userRequestCallback = (userReq: IUserRequest, res: Response, next: NextFunction) => any | Promise<any>;

// returs what we get in handler 
export const userRequestHandler = (handler: userRequestCallback) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userReq: IUserRequest = req as IUserRequest;
            await handler(userReq, res, next); //assigning IUserRequest in handler and returning it to userRequestHandler.
        } catch (err) {
            console.log(err);
            next(err);
        }
    };
}