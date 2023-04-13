import { Request, Response, NextFunction } from 'express';
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
