import { config } from '../config/dotenv.config';
import { APIError } from '../utils/error';
import { InfuraClient } from './infuraClient';
import { Buffer } from 'buffer';
import Web3 from 'web3';
import { Hex } from 'web3-utils';

export const verifySignature = async (message: string, signature: string, sender: string) => {
    const infuraClient = new InfuraClient(config.base_url);
    const utilContract = await infuraClient.getUtilContract();

    try {
        if (signature.length < 132) throw new APIError(400, { message: 'signature is wrong' });
        else if (signature.length === 132) {
            const r = signature.slice(0, 66);
            const s = '0x' + signature.slice(66, 130);
            let v: number = parseInt('0x' + signature.slice(130, 132), 16);
            if (v === 0 || v === 1) v += 27;
            const stringMessage = `0019Ethereum Signed Message:\n ${message.length}, ${message} `;
            const hashMessage = Web3.utils.sha3(Web3.utils.toHex(stringMessage));

            if (!hashMessage) throw new APIError(400, { message: ` message formate is incorrect for \n ${message}` });

            Buffer.from(hashMessage).toString('latin1');
            const byteHashMessage = Web3.utils.hexToBytes(hashMessage); //Converting hashMessage to bytes
            const byteR = Web3.utils.hexToBytes(r);
            const byteS = Web3.utils.hexToBytes(s);
            const verifyAddress = await utilContract.methods.verifySignature(byteHashMessage, v, byteR, byteS).call();
            return verifyAddress
        } else {
            const hashMessage = Web3.utils.sha3(Web3.utils.toHex(message));

            if (!hashMessage) throw new APIError(400, { message: ` message formate is incorrect for \n ${message}` });

            const byteHashMessage = Web3.utils.hexToBytes(hashMessage);
            const erc1271CoreContract = await infuraClient.getDapperUserContract(sender);
            const magicValue = erc1271CoreContract.methods().isValidSignature(byteHashMessage, Web3.utils.hexToBytes(signature)).call();

            return '0x' + magicValue.encode('latin1').encode('hex') == 'placed in configs'; //ERC1271_MAGIC_VALUE
        }
    } catch (err) {
        throw new APIError(400, { message: 'Something gone wrong' });
    }
};


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