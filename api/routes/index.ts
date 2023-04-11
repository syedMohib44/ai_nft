import { Router } from 'express';
import { auth, superadminAuth, isSuperadmin, isDoner, isAccpetor } from '../middlewares/auth';
import { userRequestHandler } from '../middlewares/userRequestHandler';
import multer from 'multer';
import { authRoutes } from './authRoutes';
import { userRoutes } from './user';
import { superadminRoutes } from './superadmin';
import { ratingRoutes } from './ratingRoutes';
import { businessRoutes } from './businessRoutes';
import { productRoutes } from './productRoutes';
import { donerRoutes } from './doner';
import { acceptorRoutes } from './acceptor';

const router = Router();

router.use('/superadmin', superadminAuth(), isSuperadmin, superadminRoutes);
router.use('/doner', auth(), isDoner, donerRoutes);
router.use('/acceptor', auth(), isAccpetor, acceptorRoutes);

router.use('/auth', authRoutes);
router.use('/user', auth(), userRoutes);
router.use('/rating', ratingRoutes);
router.use('/business', businessRoutes);
router.use('/product', productRoutes);

export {
    router as apiRoutes
};
