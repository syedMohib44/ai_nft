import { Response, NextFunction } from 'express';
import { AddNFTsDto } from '../dto/nfts/addNFTsDto';
import { IUserRequest } from '../interface/IUserRequest';
import { findAllNFTs, findAllNFT_ById, FindNFT_OptionPaginate } from '../services/nft-service/findNFTs.service';
import { insertNFTs } from '../services/nft-service/insertNFT.service';


export const getNFTs = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const options: FindNFT_OptionPaginate = {
            select: req.query.select,
            page: req.query.page ? +req.query.page : 1,
            userId: req.user.userId,
            limit: req.query.limit ? +req.query.limit : 10,
            sort: req.query.sort,
            q: req.query.q as string,
        }
        const result = await findAllNFTs(options);
        res.status(200).json({ status: 'success', result });
    } catch (err) {
        next(err);
    }
}

export const getNFT_BydId = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const nftId = +req.params.id;
        const result = await findAllNFT_ById(nftId);
        res.status(200).json({ status: 'success', result });
    } catch (err) {
        next(err);
    }
}

export const postNFT = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const addNFTsDto: AddNFTsDto = {
            user: req.user.userId,
            address: req.user.address,
            amount: req.body.amount,
            tokenId: +req.body.tokenId,
            txId: req.body.txId,
            generateArt: req.body.generateArt,
            hash: req.body.hash,
            put: req.body.put
        };
        const data = await insertNFTs(addNFTsDto);
        res.status(200).json({ status: 'success', data });
    } catch (err) {
        next(err);
    }
}

// Fitness app using AI
// Audio to text for health app
// Online therapist Audio to Audio