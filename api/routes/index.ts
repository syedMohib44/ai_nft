import { Router,Request, Response } from 'express';
import { auth, superadminAuth, isSuperadmin, googleAuth, googleAuthCallBack } from '../middlewares/auth';
import { userRequestHandler } from '../middlewares/userRequestHandler';
import multer from 'multer';
import { authRoutes } from './authRoutes';
import { userRoutes } from './user';
import { superadminRoutes } from './superadmin';
import passport from 'passport';


const router = Router();

router.use('/superadmin', superadminAuth(), isSuperadmin, superadminRoutes);



router.use('/auth', authRoutes);
router.get('/google-auth', googleAuth);

// router.get('/google-auth/callback', passport.authenticate('google', {session: false}), googleAuthCallBack);
router.get('/google-auth/callback', googleAuthCallBack);

router.use('/user', auth(), userRoutes);

export {
    router as apiRoutes
};
