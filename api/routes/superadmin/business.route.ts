import { Router } from 'express';
import { getBusinesses, postDeactivate } from '../../controllers/nft.controller';
import { userRequestHandler } from '../../middlewares/userRequestHandler';

const router = Router();

router.put('/deactivate', userRequestHandler(postDeactivate));

export {
    router as businessRoutes
}