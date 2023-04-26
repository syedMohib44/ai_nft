import { Response, NextFunction } from 'express';
import { AddArtDto } from '../dto/art/addArtDto';
import { RemoveArtDto } from '../dto/art/removeArtDto';
import { Config } from '../interface/IHGConfig';
import { Options } from '../interface/IHGOptions';
import { IUserRequest } from '../interface/IUserRequest';
import { findAllArts, findAllArtsById, FindArt_OptionPaginate } from '../services/art-service/findGeneratedArt.service';
import { insertGeneratedArt } from '../services/art-service/insertGeneratedArt.service';
import { removeAllArtById, removeGeneratedArt } from '../services/art-service/removeGeneratedArt.service';


export const getArts = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const options: FindArt_OptionPaginate = {
            select: req.query.select,
            page: req.query.page ? +req.query.page : 1,
            userId: req.user.userId,
            limit: req.query.limit ? +req.query.limit : 10,
            sort: req.query.sort,
            q: req.query.q as string
        }
        const result = await findAllArts(options);
        res.status(200).json({ status: 'success', result });
    } catch (err) {
        next(err);
    }
}

export const gertAllArtById = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const nftId = +req.params.id;
        const result = await findAllArtsById(nftId);
        res.status(200).json({ status: 'success', result });
    } catch (err) {
        next(err);
    }
}

export const postART = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const addArtDto: AddArtDto = {
            user: req.user.userId,
            wish: req.body.wish,
            description: req.body.description,
            name: req.body.name
        };
        console.log(addArtDto);

        //stabilityai/stable-diffusion-2
        //CompVis/stable-diffusion-v1-4
        const config: Config = {
            model: 'stabilityai/stable-diffusion-2',
            wish: req.body.wish,
            ref: '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',
            negative_prompt: '18+'
        }
        const options: Options = {
            use_gpu: true,
            use_cache: false
        }
        await insertGeneratedArt(addArtDto, config, options);
        res.status(200).json({ status: 'success' });
    } catch (err) {
        next(err);
    }
}


export const deleteART = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const removeArtDto: RemoveArtDto = {
            user: req.user.userId,
            tag: req.body.tag
        };
        await removeGeneratedArt(removeArtDto);
        res.status(200).json({ status: 'success' });
    } catch (err) {
        next(err);
    }
}


export const deleteAllART = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const removeArtDto: RemoveArtDto = {
            user: req.user.userId,
            tag: req.body.tag
        };
        await removeAllArtById(removeArtDto);
        res.status(200).json({ status: 'success' });
    } catch (err) {
        next(err);
    }
}

