import { Request, Response, NextFunction } from 'express';
import Web3 from 'web3';
import { IUserRequest } from '../interface/IUserRequest';
import { APIError } from '../utils/error';

type userRequestCallback = (userReq: IUserRequest, res: Response, next: NextFunction) => any | Promise<any>;

// returs what we get in handler 
export const userRequestHandler = (handler: userRequestCallback) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userReq: IUserRequest = req as IUserRequest;

            if (!Web3.utils.isAddress(userReq.user.address))
                throw new APIError(400, {
                    message: 'Address is invalid',
                    error: 'invalid_send_to_address'
                });
                
            await handler(userReq, res, next); //assigning IUserRequest in handler and returning it to userRequestHandler.
        } catch (err) {
            console.log(err);
            next(err);
        }
    };
}