import Web3 from "web3";
import fs from 'fs';
import { AddNFTsDto } from "../../dto/nfts/addNFTsDto";
import GeneratedImages from "../../entity/GeneratedArts";
import NFTs, { INFTs } from "../../entity/NFTs";
import { singMessage, unlockAccount } from "../../libs/ema_helper";
import { Web3Client } from "../../libs/infuraClient";
import { APIError } from "../../utils/error";
import { config } from "../../config";

const ipfs_uploader = require('../../utils/ipfs-uploader.cjs')


export const insertNFTs_Matic = async (addNFTsDto: AddNFTsDto) => {
    if (!addNFTsDto)
        throw new APIError(400, { message: 'Mendatory fields are empty' });

    const generatedImage = await GeneratedImages.exists({ _id: addNFTsDto.generateArt, user: addNFTsDto.user });
    if (!generatedImage)
        throw new APIError(400, { message: 'Art donot exists' });

    const nft: INFTs = new NFTs();
    nft.generateArt = addNFTsDto.generateArt;
    nft.amount = addNFTsDto.amount;
    nft.tokenId = addNFTsDto.tokenId;
    nft.txId = addNFTsDto.txId;
    nft.currencyType = "MATIC";
    await nft.save();
}

export const insertNFTs = async (addNFTsDto: AddNFTsDto) => {
    const w3 = new Web3Client('https://polygon-mumbai.g.alchemy.com/v2/N6tdxDQu3XPYqL2MqHlIkxYoegK04yzh');

    if (!addNFTsDto)
        throw new APIError(400, { message: 'Mendatory fields are empty' });

    const generatedImage = await GeneratedImages.findOne({ _id: addNFTsDto.generateArt, user: addNFTsDto.user });
    if (!generatedImage)
        throw new APIError(400, { message: 'Art donot exists' });

    if (+addNFTsDto.put) {
        if (!addNFTsDto.hash)
            throw new APIError(400, { message: 'IPFS hash not available' });
        const nft: INFTs = new NFTs();
        nft.generateArt = generatedImage._id;
        nft.txId = addNFTsDto.txId;
        nft.tokenId = addNFTsDto.tokenId;
        nft.hash = addNFTsDto.hash;
        nft.amount = addNFTsDto.amount;
        nft.currencyType = "ETH";
        generatedImage.minted = true;
        await nft.save();

        return {
            "hash": addNFTsDto.hash,
            "description": generatedImage.description,
            "name": generatedImage.name,
            "amount": addNFTsDto.amount,
            "currencyType": nft.currencyType
        }
    }

    // Adding file to IPFS
    const buffer = fs.readFileSync(`${generatedImage.tag}.png`);
    const apiKey = `Basic ${Buffer.from(`${config.infura_ipfs.api_key}:${config.infura_ipfs.api_secret}`).toString("base64")}`;
    const cid = await ipfs_uploader.uploadToIPFS(buffer, apiKey);

    const aiNFT = await w3.getAiNftDistroContract();
    const nonce1 = Math.floor(Math.random() * 429496729);
    const nonce2 = Math.floor(Math.random() * 429496729);

    // address _sender,
    // uint256 nonce1,
    // uint256 nonce2,
    // string memory _name,
    // string memory _description,
    // string memory _wish,
    // string memory _hash
    const hashed = await aiNFT.methods.getMessageHash(addNFTsDto.address, nonce1, nonce2, generatedImage.name, generatedImage.description, generatedImage.wish, cid).call();
    const token = await aiNFT.methods.getVerifySignature(addNFTsDto.address, hashed).call();
    const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));
    await unlockAccount(web3);
    const { r, s, v } = await singMessage(web3, token);

    return {
        "hash": cid,
        "wish": generatedImage.wish,
        "description": generatedImage.description,
        "name": generatedImage.name,
        "nonce1": nonce1,
        "nonce2": nonce2,
        "r": r,
        "s": s,
        "v": v,
        "token": hashed
    };
}