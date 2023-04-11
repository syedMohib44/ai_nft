import { Router } from 'express';
import { getCampaings, postCampaing, putCamaping } from '../../controllers/campaing.controller';
import { userRequestHandler } from '../../middlewares/userRequestHandler';

const router = Router();

router.get('/:id', userRequestHandler(getCampaings));
router.put('/', userRequestHandler(putCamaping));

export {
    router as campaingRoutes
}