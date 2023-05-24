import { Router } from 'express';
import { auth, superadminAuth, isSuperadmin, googleAuth, googleAuthCallBack } from '../middlewares/auth';
import { nftRoutes } from './nft.route';
import { artRoutes } from './art.route';
import multer from 'multer';
import { authRoutes } from './auth.route';
import { userRoutes } from './user';
import { superadminRoutes } from './superadmin';
import passport from 'passport';


const router = Router();

router.use('/superadmin', superadminAuth(), isSuperadmin, superadminRoutes);



router.use('/auth', authRoutes);
router.get('/google-auth', googleAuth);

// router.get('/google-auth/callback', passport.authenticate('google', {session: false}), googleAuthCallBack);
router.get('/google-auth/callback', googleAuthCallBack);

router.use('/nft', nftRoutes);
router.use('/generate-art', artRoutes);

router.use('/user', auth(), userRoutes);

export {
    router as apiRoutes
};
