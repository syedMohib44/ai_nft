import { Router } from 'express';
import { postChangePassword } from '../../controllers/user.controller';
import { userRequestHandler } from '../../middlewares/userRequestHandler';
import { artRoutes } from './art.route';
import {nftRoutes} from './nft.route';

const router = Router();

router.post('/change-password', userRequestHandler(postChangePassword));
router.use('/generate-art', artRoutes);
router.use('/nft', nftRoutes);

export {
    router as userRoutes
}