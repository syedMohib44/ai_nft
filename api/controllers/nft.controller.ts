import { Request, Response, NextFunction } from 'express';
import { IGetOptionsWithPaginate } from '../interface/IGetOptions';
import { IUserRequest } from '../interface/IUserRequest';
import { de_ActivateBusiness, showAllBusinesses } from '../services/business-service/showBusiness.service';
import { APIError } from '../utils/error';

export const getBusinesses = async (req: Request, res: Response, next: NextFunction) => {
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

export const postDeactivate = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        await de_ActivateBusiness(req.body.id, req.body.isActive);
        res.status(200).json({ status: 'Business deactivated successfully' });
    } catch (err) {
        next(err);
    }
}