import { Router } from 'express';
import multer from 'multer';
import { getProductById, getProducts, postProduct, putProduct } from '../../controllers/product.controller';
import { userRequestHandler } from '../../middlewares/userRequestHandler';
import { storage } from '../../utils/commonHelper';

const router = Router();

router.get('/', getProducts);
router.post('/', multer({
    storage: storage,
    limits: {
        fileSize: 1000 * 1 * 3000
    }
}).single('productPic'), userRequestHandler(postProduct));
router.put('/', userRequestHandler(putProduct));
router.get('/:id', userRequestHandler(getProductById));

export {
    router as productRoutes
}