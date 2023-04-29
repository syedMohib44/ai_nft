import { Router } from 'express';
import { postChangePassword } from '../../controllers/user.controller';
import { userRequestHandler } from '../../middlewares/userRequestHandler';
import { artRoutes } from './art.route';
import {nftRoutes} from './nft.route';
// import { businessRoutes } from './business.route';
// import { campaingRoutes } from './campaing.route';

const router = Router();

// router.use('/business', businessRoutes)
// router.use('/campaing', campaingRoutes);
router.post('/change-password', userRequestHandler(postChangePassword));


router.use('/generate-art', artRoutes);
router.use('/nft', nftRoutes);

export {
    router as userRoutes
}