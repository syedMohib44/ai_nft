import { config } from '../../config';
import { AddCampaingDto } from '../../dto/campaing/addCampaingDto';
import Campaings, { ICampaings } from '../../entity/ZakatRequests';
import { nanoid } from 'nanoid';
import { outputFile } from 'fs-extra';
import Products from '../../entity/Products';
import path from 'path';
import { generateSingleQrCode } from '../../libs/qrCodeGenerator';
import { APIError } from '../../utils/error';
import { sendMail } from '../../libs/mail/mail';


export interface IDocFiles {
    files: {
        [field: string]: Express.Multer.File[];
    };
}

export const insertCampaing = async (docFiles: IDocFiles, addCampaingDto: AddCampaingDto) => {
    const validFiles = /jpeg|jpg|png|pdf|doc|docx|txt|ppt|pptx|.obj|.fbx/;

    if (await campaingExists(addCampaingDto))
        throw new APIError(400, { message: 'Camaping already exists' });

    const allowedTypes = [
        'models',
        'textures',
        'images',
        'misc'
    ]

    for (const type of allowedTypes) {
        if (!addCampaingDto.files[type]) {
            throw new APIError(404, { message: `Please add ${type} file` });
        }
        for (const file of docFiles.files[type]) {
            if (!validFiles.test(file.mimetype)) {
                throw new APIError(400, { message: 'Invalid file type, only JPG/PNG/DOC/DOCX/PDF/TXT files are allowed' });
            }
        }
    }

    const product = await Products.findOne({ _id: addCampaingDto.product }).populate('business');

    if (!product)
        throw new APIError(404, { message: 'Product of the business cannot be found' });

    const campaing = new Campaings();
    campaing.name = addCampaingDto.name;
    campaing.isActive = false;
    campaing.product = product;

    const attachment = await generateSingleQrCode(campaing.name, product.business.name, campaing._id);
    //Stores the file path in qrCode.
    if (attachment.path)
        campaing.qrCode = attachment.path.toString();

    if (addCampaingDto.files) {
        const fileWritePromises: Promise<void>[] = [];
        for (const type of allowedTypes) {
            if (!addCampaingDto.files[type]) continue;

            addCampaingDto.files[type].forEach(file => {
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
            });
        }
        await Promise.all(fileWritePromises);
        await Campaings.insertMany(campaing);
    }
    // sendMail({
    //     to: config.mail.bcc[0],
    //     bcc: config.mail.bcc,
    //     subject: 'Success: Documents Uploaded to GHSure Inc',
    //     attachments: [attachment]
    // }).catch(console.error);
}



const campaingExists = async ({ name, product }: AddCampaingDto) => {
    const campaing = await Campaings.findOne({ name, product });
    return campaing;
}