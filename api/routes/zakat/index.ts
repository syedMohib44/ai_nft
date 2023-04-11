import { Router } from 'express';
import { zakatRequest } from './zakatRequest.route';

const router = Router();

router.use('/zakat', zakatRequest);

export {
    router as userRoutes
}