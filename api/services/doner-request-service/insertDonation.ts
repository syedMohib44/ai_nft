import { AddZakatRequestDto } from "../../dto/zakat-request/addAcceptorDto";
import ZakatRequests, { IZakatRequests } from "../../entity/ZakatRequests";
import { FileOperation } from "../../libs/fileOperation";
import { APIError } from "../../utils/error";

export const insertDonation = async (addZakatRequestDto: AddZakatRequestDto) => {
    if (!addZakatRequestDto)
        throw new APIError(400, { message: 'Mendatory fields are empty' });

    //TODO: Need to put web3(onchain) validation here 
    const zakatRequested = await ZakatRequests.findOne({ address: addZakatRequestDto.address });
    if (zakatRequested)
        throw new APIError(400, { message: "Zakat already requested" });

    const zakatRequest: IZakatRequests = new ZakatRequests();
    zakatRequest.user = addZakatRequestDto.user;
    zakatRequest.amount = addZakatRequestDto.amount;
    zakatRequest.duration = addZakatRequestDto.duration;
    if (addZakatRequestDto.identityCard) {
        const fo = new FileOperation();
        const image = fo.fastUploadFile(addZakatRequestDto.identityCard);
        zakatRequest.identityCard = image;
    }

    await zakatRequest.save();
}