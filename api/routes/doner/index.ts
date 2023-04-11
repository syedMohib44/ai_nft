import { Router } from 'express';
import { zakatRoutes } from './accept.route';


const router = Router();

router.use('/doner', zakatRoutes);

export {
    router as donerRoutes
};