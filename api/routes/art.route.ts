import { Router } from 'express';
import { getArts } from '../controllers/art.controller';

const router = Router();

router.get('/', getArts);

export {
    router as artRoutes
};