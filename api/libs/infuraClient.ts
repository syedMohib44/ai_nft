import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import { config } from '../config';


export class Web3Client {
    public InfuraGeneralClient: any;
    public infuraMaticClient: any;

    private web3Client!: Web3;
    aiNftContract: any;
    aiNftDistroContract: any;


    constructor(url: string) {
        this.web3Client = new Web3(new Web3.providers.HttpProvider(url));
        this.aiNftContract = null;
        this.aiNftDistroContract = null;
    }

    async getCurrentBlock() {
        return await this.web3Client.eth.getBlockNumber();
    }

    async getLatestBlockTime() {
        return (await this.web3Client.eth.getBlock('latest')).timestamp;
    }

    async getAiNftContract() {
        if (!this.aiNftContract) this.aiNftContract = new this.web3Client.eth.Contract(config.contract.ai_nft_abi as AbiItem[], config.contract.ai_nft);
        return this.aiNftContract;
    }

    async getAiNftDistroContract() {
        if (!this.aiNftDistroContract) this.aiNftDistroContract = new this.web3Client.eth.Contract(config.contract.ai_nft_distro_abi as AbiItem[], config.contract.ai_nft_distro);
        return this.aiNftDistroContract;
    }

    get getWeb3Client() {
        return this.web3Client;
    }
}
