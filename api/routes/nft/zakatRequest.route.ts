import { Router } from 'express';
import multer from 'multer';
import { userRequestHandler } from '../../middlewares/userRequestHandler';
import { storage } from '../../utils/commonHelper';


const router = Router();

// router.post('/request', multer({
//     storage: storage,
//     limits: {
//         fileSize: 1000 * 1 * 3000
//     }
// }).single('idCard'), userRequestHandler(postZakatRequest));

export {
    router as zakatRequest
};