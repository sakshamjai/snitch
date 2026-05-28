import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js';

const storage = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
})

export const uploadFile = async ({ buffer, filename, folder = 'snitch' }) => {
    const result = await storage.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName: filename,
        folder
    })
    return result;
}
