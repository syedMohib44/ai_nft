import { Router } from 'express';
import { getNFTs } from '../controllers/nft.controller';

const router = Router();

router.get('/', getNFTs);

export {
    router as nftRoutes
};