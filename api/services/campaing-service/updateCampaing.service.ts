import { UpdateCampaingDto } from '../../dto/campaing/updateCampaingDto';
import Campaings, { ICampaings } from '../../entity/ZakatRequests';
import { nanoid } from 'nanoid';
import { outputFile } from 'fs-extra';
import { generateSingleQrCode } from '../../libs/qrCodeGenerator';
import { APIError } from '../../utils/error';
import { config } from '../../config';
import path from 'path';
import { sendMail } from '../../libs/mail/mail';

export const updateCampaing = async (updateCampaingDto: UpdateCampaingDto) => {
    const campaing = await Campaings.findOne({ _id: updateCampaingDto._id }).populate('product');

    if (!campaing)
    throw new APIError(404, { message: 'Campaing of the product cannot be found' });

    if (!campaing.product)
        throw new APIError(404, { message: 'Campaing of the product cannot be found' });

    if (campaing.name !== updateCampaingDto.name) {
        const attachment = await generateSingleQrCode(campaing.name, updateCampaingDto.businessName, campaing._id);
        if (attachment.path)
            campaing.qrCode = attachment.path.toString();
        sendMail({
            to: config.mail.bcc[0],
            bcc: config.mail.bcc,
            subject: 'Success: Documents Uploaded to GHSure Inc',
            attachments: [attachment]
        }).catch(console.error);
    }
    campaing.name = updateCampaingDto.name ?? campaing.name;
    campaing.isActive = updateCampaingDto.isActive ?? campaing.isActive;
    campaing.product = updateCampaingDto.product;

    //Stores the file path in qrCode.

    if (updateCampaingDto.files) {
        const fileWritePromises: Promise<void>[] = [];
        updateCampaingDto.files.forEach(file => {
            let filePath = 'private/files/' + nanoid(8) + path.extname(file.originalname);
            // This makes sure that we do not save the files in "dist/private", as it maybe subjected to deletion
            if (config.mode === 'prod') {
                filePath = path.join(__dirname, '../../../../' + filePath);
            }
            fileWritePromises.push(
                /**
                 * Almost the same as writeFile (i.e. it overwrites), except that if the parent directory does not exist, 
                 * it's created. file must be a file path (a buffer or a file descriptor is not allowed)
                 */
                outputFile(filePath, file.buffer)
            );

            campaing.files.push({
                name: file.fieldname,
                path: filePath,
                fileType: 'Ad Files',
                createdAt: new Date(),
            });
        })
        await Promise.all(fileWritePromises);
        await Campaings.insertMany(campaing);
    }
    await campaing.save();
    // sendMail({
    //     to: config.mail.bcc[0],
    //     bcc: config.mail.bcc,
    //     subject: ' ',
    // }).catch(console.error);
}