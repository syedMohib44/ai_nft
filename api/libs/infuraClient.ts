import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import { config } from '../config';


export class InfuraClient {
    public InfuraGeneralClient: any;
    public infuraMaticClient: any;

    private web3Client!: Web3;
    dataContract: any;
    maticDataContract: any;
    stakingDataContract: any;
    stakingContract: any;
    pfpContract: any;
    pfpDataContract: any;
    worldContract: any;
    transformContract: any;
    transformDataContract: any;
    erc721Contract: any;
    emontContract: any;
    rankDataContract: any;
    ladderContract: any;
    ladderPracticeContract: any;
    rankRewardContract: any;
    tradeContract: any;
    utilContract: any;
    referContract: any;
    energyContract: any;
    rankBattleContract: any;
    adventurePresaleContract: any;
    adventureItemContract: any;
    adventureExploreContract: any;
    adventureDataContract: any;
    adventureRevenueContract: any;
    claimRewardContract: any;
    weightContract: any;

    constructor(url: string) {
        this.web3Client = new Web3(new Web3.providers.HttpProvider(url));
        this.dataContract = null;
        this.maticDataContract = null;
        this.pfpContract = null;
        this.pfpDataContract = null;
        this.stakingDataContract = null;
        this.stakingContract = null;
        this.worldContract = null;
        this.transformContract = null;
        this.transformDataContract = null;
        this.erc721Contract = null;
        this.emontContract = null;
        this.rankDataContract = null;
        this.ladderContract = null;
        this.ladderPracticeContract = null;
        this.rankRewardContract = null;
        this.tradeContract = null;
        this.utilContract = null;
        this.referContract = null;
        this.energyContract = null;
        this.rankBattleContract = null;
        this.adventurePresaleContract = null;
        this.adventureItemContract = null;
        this.adventureExploreContract = null;
        this.adventureDataContract = null;
        this.adventureRevenueContract = null;
        this.claimRewardContract = null;
        this.weightContract = null;
    }

    async getCurrentBlock() {
        return await this.web3Client.eth.getBlockNumber();
    }

    async getCurrentEthermonBalance(address: string) {
        return await this.web3Client.eth.getBalance(address);
    }

    async getLatestBlockTime() {
        return (await this.web3Client.eth.getBlock('latest')).timestamp;
    }

    async getDataContract() {
        if (!this.dataContract) this.dataContract = new this.web3Client.eth.Contract(config.contract.data_contrat_abi as AbiItem[], config.contract.data_contrat);
        return this.dataContract;
    }

    async getWeightContract() {
        if (!this.weightContract) this.weightContract = new this.web3Client.eth.Contract(config.contract.weight_contract_abi as AbiItem[], config.contract.weight_contract);
        return this.weightContract;
    }

    async getMaticDataContract() {
        if (!this.maticDataContract) this.maticDataContract = new this.web3Client.eth.Contract(config.contract.data_contrat_abi as AbiItem[], config.contract.data_contract_matic);
        return this.maticDataContract;
    }

    async getStakingDataContract() {
        if (!this.stakingDataContract) this.stakingDataContract = new this.web3Client.eth.Contract(config.contract.staking_data_contract_abi as AbiItem[], config.contract.staking_data_contract_test);
        return this.stakingDataContract;
    }

    async getStakingContract() {
        if (!this.stakingContract) this.stakingContract = new this.web3Client.eth.Contract(config.contract.staking_contract_abi as AbiItem[], config.contract.staking_contract_test);
        return this.stakingContract;
    }
    //PFP
    async getPFPContract() {
        if (!this.stakingDataContract) this.stakingDataContract = new this.web3Client.eth.Contract(config.contract.staking_data_contract_abi as AbiItem[], config.contract.staking_data_contract_test);
        return this.stakingDataContract;
    }

    async getPFPDataContract() {
        if (!this.stakingContract) this.stakingContract = new this.web3Client.eth.Contract(config.contract.pfp_data_contract_abi as AbiItem[], config.contract.pfp_data_contract);
        return this.stakingContract;
    }
    //PFP

    async getWorldContract() {
        if (!this.worldContract) this.worldContract = new this.web3Client.eth.Contract([], '');
        return this.worldContract;
    }

    async getTransformDataContract() {
        if (!this.transformDataContract) this.transformDataContract = new this.web3Client.eth.Contract([], '');
        return this.transformDataContract;
    }

    async getTransformContract() {
        if (!this.transformContract) this.transformContract = new this.web3Client.eth.Contract([], '');
        return this.transformContract;
    }

    async getERC721Contract() {
        if (!this.erc721Contract) this.erc721Contract = new this.web3Client.eth.Contract([], '');
        return this.erc721Contract;
    }

    async getEmontContract() {
        if (!this.emontContract) this.emontContract = new this.web3Client.eth.Contract([], '');
        return this.emontContract;
    }

    async getRankDataContract() {
        if (!this.rankBattleContract) this.emontContract = new this.web3Client.eth.Contract([], '');
        return this.emontContract;
    }

    async getLadderContract() {
        if (!this.ladderContract) this.ladderContract = new this.web3Client.eth.Contract([], '');
        return this.ladderContract;
    }

    async getRankRewardContract() {
        if (!this.rankRewardContract) this.rankRewardContract = new this.web3Client.eth.Contract([], '');
        return this.rankRewardContract;
    }

    async getTradeContract() {
        if (!this.tradeContract) this.tradeContract = new this.web3Client.eth.Contract([], '');
        return this.tradeContract;
    }

    async getUtilContract() {
        if (!this.utilContract) this.utilContract = new this.web3Client.eth.Contract([], '');
        return this.utilContract;
    }

    async getLadderPracticeContract() {
        if (!this.ladderPracticeContract) this.ladderPracticeContract = new this.web3Client.eth.Contract([], '');
        return this.ladderPracticeContract;
    }

    async getReferContract() {
        if (!this.referContract) this.referContract = new this.web3Client.eth.Contract([], '');
        return this.referContract;
    }

    async getEnergyContract() {
        if (!this.energyContract) this.energyContract = new this.web3Client.eth.Contract([], '');
        return this.energyContract;
    }

    async getRankBattleContract() {
        if (!this.rankBattleContract) this.rankBattleContract = new this.web3Client.eth.Contract([], '');
        return this.rankBattleContract;
    }

    async getAdventurePresaleContract() {
        if (!this.adventurePresaleContract) this.adventurePresaleContract = new this.web3Client.eth.Contract([], '');
        return this.adventurePresaleContract;
    }

    async getAdventureItemContract() {
        if (!this.adventureItemContract) this.adventureItemContract = new this.web3Client.eth.Contract([], '');
        return this.adventureItemContract;
    }

    async getAdventureExploreContract() {
        if (!this.adventureExploreContract) this.adventureExploreContract = new this.web3Client.eth.Contract([], '');
        return this.adventureExploreContract;
    }

    async getAdventureDataContract() {
        if (!this.adventureDataContract) this.adventureDataContract = new this.web3Client.eth.Contract([], '');
        return this.adventureDataContract;
    }

    async getAdventureRevenueContract() {
        if (!this.adventureRevenueContract) this.adventureRevenueContract = new this.web3Client.eth.Contract([], '');
        return this.adventureRevenueContract;
    }

    async getClaimRewardContract() {
        if (!this.claimRewardContract) this.claimRewardContract = new this.web3Client.eth.Contract([], '');
        return this.claimRewardContract;
    }

    async getDapperUserContract(address: string) {
        const contract = new this.web3Client.eth.Contract([], address);
        return contract;
    }

    get getWeb3Client() {
        return this.web3Client;
    }

    // async getGeneralInfuraClient() {
    //     if (!this.InfuraGeneralClient)

    // }
    // infura_general_client = InfuraClient(INFURA_API_URLS["general"])
    // return infura_general_client

    // def get_matic_infura_client():
    // global infura_matic_client
    // if infura_matic_client is None:
    // infura_matic_client = InfuraClient(INFURA_API_URLS["cron_task_matic"])
    // return infura_matic_client
}
