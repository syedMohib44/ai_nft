import { Request, Response, NextFunction } from 'express';
import { resendVerificationEmail, verifyEmail } from '../services/auth-service/emailVerification.service';
import { insertUser } from '../services/auth-service/registeUser.service';
// import { insertUserAsOwner } from '../services/auth-service/registerDoner.service';

export const ownerRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await insertUser({ ...req.body, profilePic: req.file });
        res.status(201).json({ message: 'registration successful' });
    } catch (err) {
        next(err);
    }
};

export const putVerifyEmail = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        await verifyEmail(req.body.code);
        res.status(201).json({ message: 'registration successful' });
    } catch (err) {
        next(err);
    }
}

export const postResendVerifyEmail = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        await resendVerificationEmail(req.body.address);
        res.status(201).json({ message: 'registration successful' });
    } catch (err) {
        next(err);
    }
}