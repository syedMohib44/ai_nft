import { Request, Response, NextFunction } from 'express';
import { IGetOptionsWithPaginate } from '../interface/IGetOptions';
import { insertRating } from '../services/rating-service/insertRating.service';
import { showCalculatedRating, showRatings } from '../services/rating-service/showRatings.service';

export const postRating = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await insertRating(req.body);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

export interface ShowRatingOptionsPaginate extends IGetOptionsWithPaginate {
    productId?: string;
}

export const getRatings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const options: ShowRatingOptionsPaginate = {
            select: req.query.select,
            page: +!!req.query.page,
            limit: +!!req.query.limit || 10,
            sort: req.query.sort,
            populate: req.query.populate,
            q: req.query.q as string,
            productId: req.query.productId as string
        };
        if (req.query.hasOwnProperty('pagination')) {
            options.pagination = +!!req.query.pagination === 1;
        }
        const result = await showRatings(options)
        res.status(200).json({ message: result });
    } catch (err) {
        next(err);
    }
}


export const getAvgRatings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await showCalculatedRating(req.params.id)
        res.status(200).json({ status: 'success', result });
    } catch (err) {
        next(err);
    }
}