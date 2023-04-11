import { Router } from 'express';
import { getProducts } from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);

export {
    router as productRoutes
};