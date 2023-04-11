import { Router } from 'express';
// import { businessRoutes } from './business.route';
// import { campaingRoutes } from './campaing.route';
import { productRoutes } from './product.route';

const router = Router();

// router.use('/business', businessRoutes)
// router.use('/campaing', campaingRoutes);
router.use('/product', productRoutes);

export {
    router as userRoutes
}