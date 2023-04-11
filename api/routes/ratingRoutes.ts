import { Router } from 'express';
import { getAvgRatings, getRatings, postRating } from '../controllers/rating.controller';

const router = Router();

router.post('/', postRating);
router.get('/', getRatings);
router.get('/:id', getAvgRatings);

export {
    router as ratingRoutes
};