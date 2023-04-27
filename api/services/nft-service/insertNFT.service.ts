import Web3 from "web3";
import fs from 'fs';
import { AddNFTsDto } from "../../dto/nfts/addNFTsDto";
import GeneratedImages from "../../entity/GeneratedArts";
import NFTs, { INFTs } from "../../entity/NFTs";
import { singMessage, unlockAccount } from "../../libs/ema_helper";
import { InfuraClient } from "../../libs/infuraClient";
import { APIError } from "../../utils/error";

const ipfs_uploader = require('../../utils/ipfs-uploader.cjs')


export const insertNFTs_Matic = async (addNFTsDto: AddNFTsDto) => {
    if (!addNFTsDto)
        throw new APIError(400, { message: 'Mendatory fields are empty' });

    //TODO: Need to put web3(onchain) validation here 
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
    if (!Web3.utils.isAddress(addNFTsDto.address))
        throw new APIError(400, {
            message: 'Address is invalid',
            error: 'invalid_send_to_address'
        });

    const w3 = new InfuraClient('https://polygon-mumbai.g.alchemy.com/v2/N6tdxDQu3XPYqL2MqHlIkxYoegK04yzh');

    if (!addNFTsDto)
        throw new APIError(400, { message: 'Mendatory fields are empty' });
    //TODO: Need to put web3(onchain) validation here 

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
    const cid = await ipfs_uploader.uploadToIPFS(buffer);
    // const { create } = await import('ipfs-core')
    // const gateway = 'https://ipfs.io/ipfs/'
    // const ipfs = await create();
    // const buffer = fs.readFileSync(`${generatedImage.tag}.png`);
    // const ipfsHash = await ipfs.add(buffer)
    // console.log(ipfsHash.cid , ' ==== ', ipfsHash.path)


    const aiNFT = await w3.getAiNftDistroContract();
    const nonce1 = Math.floor(Math.random() * 429496729);
    const nonce2 = Math.floor(Math.random() * 429496729);

    const hashed = await aiNFT.methods.getMessageHash(addNFTsDto.address, nonce1, nonce2, generatedImage.name, generatedImage.description, cid).call();
    const token = await aiNFT.methods.getVerifySignature(addNFTsDto.address, hashed).call();
    const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));
    await unlockAccount(web3);
    const { r, s, v } = await singMessage(web3, token);

    return {
        "hash": addNFTsDto.hash,
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