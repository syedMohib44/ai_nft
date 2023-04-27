import { Router } from 'express';
import { findAllArts } from '../../services/art-service/findGeneratedArt.service';
import { findAllNFTs } from '../../services/nft-service/findNFTs.service';

const router = Router();

router.get('/nft', findAllNFTs);
router.get('/art', findAllArts);

export {
    router as nftRoutes
}