import { Router } from 'express';
// import { businessRoutes } from './business.route';
// import { campaingRoutes } from './campaing.route';
import { nftRoutes } from './nft.route';

const router = Router();

// router.use('/business', businessRoutes)
// router.use('/campaing', campaingRoutes);
router.use('/product', nftRoutes);

export {
    router as userRoutes
}