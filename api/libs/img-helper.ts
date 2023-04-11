import Jimp from 'jimp';

const resizeImageAndGetBuffer = async (
    img: string | Buffer | Jimp,
    width: number,
    height: number,
    options?: { mime: string }
) => {
    const jimpImg = await Jimp.read(img as Jimp);
    return await jimpImg
        .contain(width, height)
        .getBufferAsync(options?.mime || Jimp.MIME_JPEG);
};

export const imgHelper = {
    resize: resizeImageAndGetBuffer,
};
