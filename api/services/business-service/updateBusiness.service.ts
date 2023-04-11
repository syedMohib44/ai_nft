import { config } from "../../config";
import { UpdateBusinessDto } from "../../dto/business/updateBusinessDto";
import Businesses, { IResizedLogo } from "../../entity/Businesses"
import { FileOperation } from "../../libs/fileOperation";
import { imgHelper } from "../../libs/img-helper";
import { APIError } from "../../utils/error";
import Jimp from 'jimp';

export const updateBusinessById = async (_id: string, updateBusinessDto: UpdateBusinessDto) => {
    const business = await Businesses.findOne({ _id });
    if (!business)
        throw new APIError(404, { message: 'Business not found' });

    business.name = updateBusinessDto.name || business.name;
    business.timezone = updateBusinessDto.timezone || business.timezone;
    business.address = updateBusinessDto.address || business.address;
    if (updateBusinessDto.avatar) {
        const avatarFile = 'public' + updateBusinessDto.avatar.replace(config.base_url, ''); // get the actual file path
        // resize and save
        const logos = await resizeAndUploadMultipleImg(avatarFile, business.resizedLogos);
        business.logo = logos[0].logo;
        business.resizedLogos = logos;
    } else if (updateBusinessDto.logo) {
        // resize and save
        const logos = await resizeAndUploadMultipleImg(updateBusinessDto.logo.buffer, business.resizedLogos);
        business.logo = logos[0].logo;
        business.resizedLogos = logos;
    }

    business.type = updateBusinessDto.type || business.type;
    business.hoursOfOperations = updateBusinessDto.hoursOfOperations || business.hoursOfOperations;

    await business.save();
}


const deleteImgFile = (imgPath: string) => {
    const fo = new FileOperation();
    return fo.deleteFile(imgPath);
};

const resizeAndUploadMultipleImg = async (img: string | Buffer, existingImgPaths?: IResizedLogo[]): Promise<IResizedLogo[]> => {
    const sizes = [{ txt: '152x152', size: 152 }, { txt: '192x192', size: 192 }, { txt: '512x512', size: 512 }];

    const deleteImgPromises: Promise<void>[] = [];
    const logos: IResizedLogo[] = [];

    for (const logoSize of sizes) {
        const bufferImg = await imgHelper.resize(img, logoSize.size, logoSize.size, { mime: Jimp.MIME_PNG });

        const fo = new FileOperation();

        // delete existing images
        const existingLogo = existingImgPaths?.find(eImg => eImg.size === logoSize.txt)?.logo;
        if (existingLogo) {
            deleteImgPromises.push(
                deleteImgFile(existingLogo)
            );
        }

        // upload file
        logos.push({ logo: fo.fastUploadBuffer(bufferImg, null, { ext: 'png' }), size: logoSize.txt });
    }

    Promise.all(deleteImgPromises)
        .then(r => r)
        .catch(console.error);

    return logos;
};