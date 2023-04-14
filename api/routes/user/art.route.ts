import { Router } from 'express';
import multer from 'multer';
import { deleteART, getArts, postART } from '../../controllers/art.controller';
import { userRequestHandler } from '../../middlewares/userRequestHandler';
import { storage } from '../../utils/commonHelper';

const router = Router();

router.post('/', userRequestHandler(postART));
router.get('/', userRequestHandler(getArts));


//Only for testing will not include in production
router.delete('/', userRequestHandler(deleteART));

export {
    router as artRoutes
}