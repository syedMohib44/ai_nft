import { Request, Response, NextFunction } from 'express';
import { JWTPAYLOAD } from '../interface/JWTPayload';
import { config } from '../config';
import { preProcessingGO } from '../services/auth-service/login.service';
import { IUserRequest } from '../interface/IUserRequest';
import passport from 'passport';


export const auth = () => (req: Request, res: Response, next: NextFunction) => {
    return passport.authenticate('jwt', { session: false })(req, res, next);
};

export const superadminAuth = () => (req: Request, res: Response, next: NextFunction) => {
    //Checks if superadmin is going to signup or login on already loggedin if not othe the routes are there then its a false route
    if (isPathAllowed(req.originalUrl)) {
        return next();
    }
    return passport.authenticate('jwt', { session: false })(req, res, next);
};

export const isSuperadmin = (req: Request, res: Response, next: NextFunction) => {
    if (isPathAllowed(req.originalUrl)) {
        return next();
    }

    const payload = req.user as JWTPAYLOAD;
    if (payload.typeOfUser === 'admin') {
        return next();
    }
    res.sendStatus(401);
};

const isPathAllowed = (url: string) => {
    const allowedRoutes = ['login', 'signup', 'token'];
    return allowedRoutes.some(r => url.endsWith(r));
};


export const isUser = (req: Request, res: Response, next: NextFunction) => {
    if (isPathAllowed(req.originalUrl)) {
        return next();
    }

    const payload = req.user as JWTPAYLOAD;
    if (payload.typeOfUser === 'user') {
        return next();
    }
    res.sendStatus(401);
};

export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
    return passport.authenticate('google', {
        scope: [
            'email',
            'profile'
        ]
    })(req, res, next);
};


export const googleAuthCallBack = (req: Request, res: Response, next: NextFunction) => {
    //{ successRedirect: 'http://localhost:3000', failureRedirect: 'http://localhost:3000/login' },
    return passport.authenticate('google', async (err: any, profile: any) => {
        if (profile) {
            const payload = await preProcessingGO(profile.username, 'google');
            try {
                res.status(200).json({
                    data: { payload }
                });
            } catch (err) {
                next(err);
            }
        }
        else { res.sendStatus(401); }
    })(req, res, next);
};