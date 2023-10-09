import { Router } from 'express';
import { getUserExists, loginUser, logout, postForgotPassword, postVerifyForgotPassword, tokenRefresh } from '../controllers/user.controller';
import { ownerRegister, postResendVerifyEmail, putVerifyEmail } from '../controllers/auth.controller';
import { userRequestHandler } from '../middlewares/userRequestHandler';
import multer from 'multer';
import { nanoid } from 'nanoid';
import fs from 'fs';
import { storage } from '../utils/commonHelper';

const router = Router();

router.post('/login', loginUser);
router.post('/refreshToken', tokenRefresh);

router.put('/verify-email', putVerifyEmail);
router.post('/resend-verify-email', postResendVerifyEmail);
router.post('/forgot-password', postForgotPassword);
router.post('/reset-password', postVerifyForgotPassword);

router.get('/:address', getUserExists);

// router.post('/logout', userRequestHandler(logout));
router.post('/register', multer({
    storage: storage,
    limits: {
        fileSize: 1000 * 1 * 3000
    }
}).single('profilePic'), ownerRegister);

export {
    router as authRoutes
};