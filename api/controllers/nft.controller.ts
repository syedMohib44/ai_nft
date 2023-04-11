import { Request, Response, NextFunction } from 'express';
import { IGetOptionsWithPaginate } from '../interface/IGetOptions';
import { IUserRequest } from '../interface/IUserRequest';
import { APIError } from '../utils/error';

export const getNFTs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const options: IGetOptionsWithPaginate = {
            select: req.query.select,
            page: req.query.page ? +req.query.page : 1,
            limit: req.query.limit ? +req.query.limit : 10,
            sort: req.query.sort,
            q: req.query.q as string,
        }
        const result = await showAllBusinesses(options);
        res.status(200).json({ status: 'success', result });
    } catch (err) {
        next(err);
    }
}