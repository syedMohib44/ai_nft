import { Router } from 'express';
import { artRoutes } from './art.route';
// import { businessRoutes } from './business.route';
// import { campaingRoutes } from './campaing.route';

const router = Router();

// router.use('/business', businessRoutes)
// router.use('/campaing', campaingRoutes);
router.use('/generate-art', artRoutes);

export {
    router as userRoutes
}