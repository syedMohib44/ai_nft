import { Router } from 'express';
import multer from 'multer';
import { getNFTs, getNFT_BydId, postNFT } from '../../controllers/nft.controller';
import { userRequestHandler } from '../../middlewares/userRequestHandler';
import { storage } from '../../utils/commonHelper';

const router = Router();

router.get('/', userRequestHandler(getNFTs));
router.get('/:id', userRequestHandler(getNFT_BydId));
router.post('/', userRequestHandler(postNFT));

export {
    router as nftRoutes
}