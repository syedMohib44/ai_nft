import { DepositeZakatDto } from "../../dto/deposite-zakat/addZakatDto";
import { WithdrawZakatDto } from "../../dto/withdraw-zakat/AddNFTsDto";
import { AddZakatRequestDto } from "../../dto/zakat-request/addAcceptorDto";
import DepositeZakats from "../../entity/DepositeZakats";
import WithdrawZakats, { IWithdrawZakats } from "../../entity/NFTs";
import ZakatRequests, { IZakatRequests } from "../../entity/ZakatRequests";
import { FileOperation } from "../../libs/fileOperation";
import { APIError } from "../../utils/error";

export const depositeZakat_Matic = async (depositeZakatDto: DepositeZakatDto) => {
    if (!depositeZakatDto)
        throw new APIError(400, { message: 'Mendatory fields are empty' });

    //TODO: Need to put web3(onchain) validation here 

    const depositeZakat = new DepositeZakats();
    depositeZakat.user = depositeZakatDto.user;
    depositeZakat.amount = depositeZakatDto.amount;
    depositeZakat.currencyType = "MATIC";
    await depositeZakat.save();
}

export const depositeZakat = async (depositeZakatDto: WithdrawZakatDto) => {
    if (!depositeZakatDto)
        throw new APIError(400, { message: 'Mendatory fields are empty' });

    //TODO: Need to put web3(onchain) validation here 

    const depositeZakat = new DepositeZakats();
    depositeZakat.user = depositeZakatDto.user;
    depositeZakat.amount = depositeZakat.amount;
    depositeZakat.currencyType = "ZKT";
    await depositeZakat.save();
}