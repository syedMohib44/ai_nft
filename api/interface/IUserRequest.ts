import { Request } from 'express';
import { JWTPAYLOAD } from './JWTPayload';

export interface IUserRequest extends Request {
    user: JWTPAYLOAD;
}