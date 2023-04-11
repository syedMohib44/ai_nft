import { Request, Response, NextFunction } from 'express';
import { UpdateCampaingDto } from '../dto/campaing/updateCampaingDto';
import { IProducts } from '../entity/Products';
import { IGetOptionsWithPaginate } from '../interface/IGetOptions';
import { IUserRequest } from '../interface/IUserRequest';
import { insertCampaing } from '../services/campaing-service/insertCampaing.service';
import { showCamapings, showCampaingById } from '../services/campaing-service/showCampaing.service';
import { updateCampaing } from '../services/campaing-service/updateCampaing.service';

export const postCampaing = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        console.log(req.files);
        console.log(req.body);
        //await insertCampaing({ files: req.files as any }, req.body);
        res.sendStatus(201);
    } catch (err) {
        next(err);
    }
}

export interface ShowCamapingOptionPaginate extends IGetOptionsWithPaginate {
    productId?: IProducts['_id'];
}

export const getCampaings = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const options: ShowCamapingOptionPaginate = {
            select: req.query.select,
            page: req.query.page ? +req.query.page : 1,
            limit: req.query.limit ? +req.query.limit : 10,
            sort: req.query.sort,
            q: req.query.q as string,
            search: req.query,
            productId: req.query.productId as string
        }
        const result = await showCamapings(options)
        res.status(200).json({ status: 'success', result })
    } catch (err) {
        next(err);
    }
}

export const getCamapingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = showCampaingById(req.params.id);
        res.status(200).json({ status: 'success', result });
    } catch (err) {
        next(err);
    }
}


export const putCamaping = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const updateCampaingDto: UpdateCampaingDto = { ...req.body, businessName: req.user.business.name };
        await updateCampaing(updateCampaingDto);
        res.status(200).json({ status: 'success', data: 'Camapaing updated successfylly' });
    } catch (err) {
        next(err);
    }
}