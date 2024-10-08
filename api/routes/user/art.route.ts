import { Router } from 'express';
import multer from 'multer';
import { deleteAllART, deleteART, getArts, postART, postArtToIPFS, putArt } from '../../controllers/art.controller';
import { userRequestHandler } from '../../middlewares/userRequestHandler';
import { storage } from '../../utils/commonHelper';

const router = Router();

router.get('/', userRequestHandler(getArts));
router.post('/', userRequestHandler(postART));
router.put('/', userRequestHandler(putArt));
router.post('/ipfs', userRequestHandler(postArtToIPFS));
//Only for testing will not include in production
router.delete('/', userRequestHandler(deleteART));
router.delete('/all', userRequestHandler(deleteAllART));

export {
    router as artRoutes
}