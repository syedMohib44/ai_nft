import { Request, Response, NextFunction } from 'express';
import { AddProductDto } from '../dto/product/addProductDto';
import { IGetOptionsWithPaginate } from '../interface/IGetOptions';
import { IUserRequest } from '../interface/IUserRequest';
import { IMailOptions } from '../libs/mail/mail';
import { insertProduct } from '../services/product-service/insertProduct.service';
import { showProducts, showProductsById } from '../services/product-service/showProduct.service';
import { updateProduct } from '../services/product-service/updateProduct.service';

export const postProduct = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const product: AddProductDto = {
            name: req.body.name,
            business: req.user.business._id,
            businessName: req.body.business_ame,
            price: req.body.price,
            productPic: req.file
        }
        await insertProduct(product);
        res.sendStatus(201);
    } catch (err) {
        next(err);
    }
}

export interface ShowProductOptionPaginate extends IGetOptionsWithPaginate {
    businessId?: string;
}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const options: ShowProductOptionPaginate = {
            select: req.query.select,
            page: req.query.page ? +req.query.page : 1,
            limit: req.query.limit ? +req.query.limit : 10,
            sort: req.query.sort,
            q: req.query.q as string,
            businessId: req.query.businessId as string
        }
        if (req.query.hasOwnProperty('pagination'))
            options.pagination = +!!req.query.pagination === 1;

        const result = await showProducts(options);
        res.status(200).json({ status: 'success', result });
    } catch (err) {
        next(err);
    }
}

export const getProductById = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const result = await showProductsById(req.user.business._id, req.params.id);
        res.status(200).json({ status: 'success', result });
    } catch (err) {
        next(err);
    }
}

export const putProduct = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        await updateProduct(req.body);
        res.status(200).json({ status: 'success', data: 'Prodcut updated successfully' });
    } catch (err) {
        next(err);
    }
}