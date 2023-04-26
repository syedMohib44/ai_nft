import Web3 from 'web3';
import { config } from '../config';

export const unlockAccount = async (web3: Web3) => {
    await web3.eth.personal.unlockAccount(config.owner_address, config.owner_password, 0);
}

export const singMessage = async (web3: Web3, msg: string) => {
    const signature: string = await web3.eth.personal.sign(msg, config.owner_address, config.owner_password);
    const r = signature.slice(0, 66);
    const s = '0x' + signature.slice(66, 130);
    let v: number = parseInt('0x' + signature.slice(130, 132), 16);
    console.log(signature);

    return { r, s, v };
}