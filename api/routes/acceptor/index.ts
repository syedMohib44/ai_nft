import { Router } from 'express';
import multer from 'multer';
import { postZakatRequest } from '../../controllers/zakatRequest.controller';
import { userRequestHandler } from '../../middlewares/userRequestHandler';
import { storage } from '../../utils/commonHelper';
import { zakatRoutes } from './donate.route';


const router = Router();

router.use('/acceptor', zakatRoutes);

export {
    router as acceptorRoutes
};