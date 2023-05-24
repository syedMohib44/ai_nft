import { Request, Response, NextFunction } from 'express';
import { AddArtDto } from '../dto/art/addArtDto';
import { RemoveArtDto } from '../dto/art/removeArtDto';
import { UpdateArtDto } from '../dto/art/updateArtDto';
import { Config } from '../interface/IHGConfig';
import { Options } from '../interface/IHGOptions';
import { IUserRequest } from '../interface/IUserRequest';
import { findAllArts, findAllArtsById, FindArt_OptionPaginate } from '../services/art-service/findGeneratedArt.service';
import { insertGeneratedArt, insertImageToIPFS } from '../services/art-service/insertGeneratedArt.service';
import { removeAllArtByUser, removeGeneratedArt } from '../services/art-service/removeGeneratedArt.service';
import { updateGeneratedArt } from '../services/art-service/updateGenerateArt.service';


export const getArts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const options: FindArt_OptionPaginate = {
            select: req.query.select,
            page: req.query.page ? +req.query.page : 1,
            userId: req.query.userId ? req.query.userId.toString() : undefined,
            address: req.query.address ? req.query.address.toString() : undefined,
            limit: req.query.limit ? +req.query.limit : 10,
            sort: req.query.sort,
            q: req.query.q as string
        }
        console.log(options, ' === ');
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
            address: req.user.address,
            wish: req.body.wish,
            description: req.body.description,
            name: req.body.name
        };

        //stabilityai/stable-diffusion-2
        //CompVis/stable-diffusion-v1-4
        const config: Config = {
            model: 'stabilityai/stable-diffusion-2',
            wish: req.body.wish,
            ref: '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',
            negative_prompt: '18+',
            height: req.body.height,
            width: req.body.width,
            guidance_scale: req.body.guidance_scale,
            num_inference_steps: req.body.num_inference_steps
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

export const putArt = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const updateArtDto: UpdateArtDto = {
            user: req.user.userId,
            address: req.user.address,
            tag: req.body.tag,
            description: req.body.description,
            name: req.body.name
        };
        await updateGeneratedArt(updateArtDto);
    } catch (err) {
        next(err);
    }
}


export const deleteART = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const removeArtDto: RemoveArtDto = {
            user: req.user.userId,
            address: req.user.address,
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
            address: req.user.address,
            tag: req.body.tag
        };
        await removeAllArtByUser(removeArtDto);
        res.status(200).json({ status: 'success' });
    } catch (err) {
        next(err);
    }
}



export const postArtToIPFS = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        await insertImageToIPFS(req.body.tag);
        res.status(200).json({ status: 'success' });
    } catch (err) {
        next(err);
    }
}


