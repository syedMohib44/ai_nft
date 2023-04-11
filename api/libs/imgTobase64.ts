import { APIError } from "../utils/error";
import { Attachment } from "nodemailer/lib/mailer";

const imagetobase64 = require('image-to-base64');

// export const CovertImgToBas64 = async (file) => {
//     const base64File = await imagetobase64(file);
//     if (!base64File)
//         throw new APIError(400, { message: 'This Image cannot be sent.' });
//     return base64File;
// }


export const ConvertImgToBas64 = (file: string) => {
    const base64File = imagetobase64(file);
    if (!base64File)
        throw new APIError(400, { message: 'This Image cannot be sent.' });

    return base64File;
}


export const base64Attachment = async (file: string) => {
    const base64Attachment: Attachment = {
        filename: file,
        content: await ConvertImgToBas64(file),
        encoding: 'base64'
    };
    return base64Attachment;
}