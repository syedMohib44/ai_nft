import { Router } from 'express';
import multer from 'multer';
import { postZakatRequest } from '../../controllers/zakatRequest.controller';
import { userRequestHandler } from '../../middlewares/userRequestHandler';
import { storage } from '../../utils/commonHelper';


const router = Router();

router.post('/request', multer({
    storage: storage,
    limits: {
        fileSize: 1000 * 1 * 3000
    }
}).single('idCard'), userRequestHandler(postZakatRequest));

router.post('/donate', postDonateZakat);

export {
    router as zakatRoutes
};