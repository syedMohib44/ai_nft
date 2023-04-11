import { Router } from 'express';
import { getBusinesses } from '../controllers/nft.controller';

const router = Router();

router.get('/', getBusinesses);

export {
    router as businessRoutes
};