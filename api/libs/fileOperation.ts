import SFTPClient from 'ssh2-sftp-client';
import moment from 'moment';
import { nanoid } from 'nanoid';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { config } from '../config';
import { Request } from 'express';
import { APIError } from '../utils/error';

export class FileOperation {
    private sftp!: SFTPClient;
    private validMimeTypes = /jpeg|jpg|png|pdf/;
    private FTP_ROOT_FILE_PATH = config.ssh.root_file_path;

    public uploadFileLocal = async (businessName: any, content: Express.Multer.File, filepath?: string | null) => {
        try {
            this.uploadFileValidate(content);

            let filePathToSave = '';
            let dirToSave = '';
            let err: Error;
            if (filepath) {
                filePathToSave = filepath;
            } else {
                const fileExt = path.extname(content.originalname).replace(/\./, '') || 'jpeg';
                //const { dir, newFilePath } = this.generateFilePathAndDir(fileExt);
                dirToSave = `./uploads/${businessName}`;
                fs.mkdirSync(dirToSave, { recursive: true });
                filePathToSave = nanoid(5) + content.originalname;
            }
            multer.diskStorage({
                destination: function (businessName, content, cb) {
                    return cb(err, dirToSave)
                },
                filename: function (businessName, content, cb) {
                    return cb(err, filePathToSave)
                }
            })._handleFile(businessName, content, (err, info) => {
                console.log(info);
                if (err) {
                    throw new APIError(err)
                }
            });

            return dirToSave + filePathToSave;
        } catch (err) {
            throw new Error('Error uploading file:' + err);
        } finally {
            this.sftp.end();
        }
    }

    /**
     * Uploads file and returns file path only after succesful file upload
     * @param filepath will create or override the file at the given path
     */
    public uploadFile = async (content: Express.Multer.File, filepath?: string | null) => {
        try {
            this.uploadFileValidate(content);

            await this.init();

            let filePathToSave = '';
            if (filepath) {
                filePathToSave = filepath;
            } else {
                const fileExt = path.extname(content.originalname).replace(/\./, '') || 'jpeg';
                const { dir, newFilePath } = this.generateFilePathAndDir(fileExt);
                await this.sftp.mkdir(dir, true);
                filePathToSave = newFilePath;
            }

            await this.sftp.put(content.buffer, this.FTP_ROOT_FILE_PATH + filePathToSave);

            return filePathToSave;
        } catch (err) {
            throw new Error('Error uploading file:' + err);
        } finally {
            this.sftp.end();
        }
    }

    /**
     * Same as upload file, but carries file upload task in background.
     * Use it when you dont have to guarantee that the file was successfully uploaded
     */
    public fastUploadFile = (content: Express.Multer.File, filepath?: string | null) => {
        try {
            this.uploadFileValidate(content);
            let filePathSaved = '';

            let sshChain: Promise<any> = this.init();

            if (filepath) {
                sshChain = sshChain
                    .then(() => this.sftp.put(content.buffer, this.FTP_ROOT_FILE_PATH + filepath));

                filePathSaved = filepath;
            } else {
                const fileExt = path.extname(content.originalname).replace(/\./, '') || 'jpeg';
                const { dir, newFilePath } = this.generateFilePathAndDir(fileExt);
                sshChain = sshChain
                    .then(() => this.sftp.mkdir(dir, true))
                    .then(() => this.sftp.put(content.buffer, this.FTP_ROOT_FILE_PATH + newFilePath));

                filePathSaved = newFilePath;
            }
            sshChain
                .then(() => this.sftp.end())
                .catch((err) => console.error(err.message));

            return filePathSaved;
        } catch (err) {
            throw new Error('Error uploading file:' + err);
        }
    }


    /**
     * Same as upload file, but carries buffer upload task in background.
     * Use it when you dont have to guarantee that the file was successfully uploaded
     */
    public fastUploadBuffer = (content: Buffer, filepath?: string | null, options?: { ext: string }) => {
        try {
            if (!content) {
                throw new Error('File content cannot be empty');
            }

            let filePathSaved = '';
            let sshChain: Promise<any> = this.init();

            if (filepath) {
                sshChain = sshChain
                    .then(() => this.sftp.put(content, this.FTP_ROOT_FILE_PATH + filepath));

                filePathSaved = filepath;
            } else {
                const { dir, newFilePath } = this.generateFilePathAndDir(options?.ext || 'jpeg');
                sshChain = sshChain
                    .then(() => this.sftp.mkdir(dir, true))
                    .then(() => this.sftp.put(content, this.FTP_ROOT_FILE_PATH + newFilePath));

                filePathSaved = newFilePath;
            }
            sshChain
                .then(() => this.sftp.end())
                .catch((err) => console.error(err.message));

            return filePathSaved;
        } catch (err) {
            throw new Error('Error uploading file:' + err);
        }
    }

    /**
     * Upload multiple files in background.
     * Use filepaths to replace the files in the given file location.
     */
    public fastUploadMultipleFile = (contents: Express.Multer.File[], filepaths?: string[]): string[] => {
        try {
            for (const file of contents) { this.uploadFileValidate(file); }

            const filePathsSaved: string[] = [];
            let sshChain: Promise<any> = this.init();
            const promises: [Buffer, string][] = [];

            if (filepaths && filepaths.length > 0) {
                // used to replace the contents at given file location
                if (filepaths.length !== contents.length) {
                    throw new Error('Contents length and filepaths length do not match');
                }
                for (let i = 0; i < contents.length; i++) {
                    promises.push([
                        contents[i].buffer,
                        this.FTP_ROOT_FILE_PATH + filepaths[i]
                    ]);
                    filePathsSaved.push(filepaths[i]);
                }
            } else {
                // create dir and add files
                let commonDir: string;
                for (let i = 0; i < contents.length; i++) {
                    const fileExt = path.extname(contents[i].originalname).replace(/\./, '') || 'jpeg';
                    const { newFilePath, dir } = this.generateFilePathAndDir(fileExt);
                    if (i === 0) {
                        commonDir = dir;
                    }
                    promises.push([
                        contents[i].buffer,
                        this.FTP_ROOT_FILE_PATH + newFilePath
                    ]);
                    filePathsSaved.push(newFilePath);
                }

                sshChain = sshChain
                    .then(() => this.sftp.mkdir(commonDir, true));
            }

            sshChain
                .then(() => Promise.all(promises.map((args) => this.sftp.put.apply(this.sftp, args))))
                .then(() => this.sftp.end())
                .catch((err) => console.error(err.message));

            return filePathsSaved;
        } catch (err) {
            throw new Error('Error uploading file:' + err);
        }
    }

    public deleteFile = async (filePath: string) => {
        if (!filePath || filePath.length < 1) {
            throw new Error('File Path cannot be empty');
        }

        try {
            await this.init();

            const fullFilePath = this.FTP_ROOT_FILE_PATH + filePath;
            await this.sftp.delete(fullFilePath);
        } catch (err) {
            throw new Error('Error deleting file:' + err);
        } finally {
            this.sftp.end();
        }
    }

    public deleteMultipleFile = async (filepaths: string[]) => {
        if (filepaths.length === 0) {
            return;
        }

        try {
            await this.init();

            const promises: Promise<string>[] = filepaths
                .map(filepath => this.sftp.delete(this.FTP_ROOT_FILE_PATH + filepath));

            await Promise.all(promises);
        } catch (err) {
            throw new Error('Error deleting file:' + err);
        } finally {
            this.sftp.end();
        }
    }

    private uploadFileValidate(content: Express.Multer.File) {
        if (!content) {
            throw new Error('File content cannot be empty');
        }

        if (!this.validMimeTypes.test(content.mimetype)) {
            throw new Error('Invalid file type');
        }
    }

    /**
     * Generates dir and file path name to be saved
     * @param fileExt file extension. Example: jpeg, png etc..
     */
    private generateFilePathAndDir(fileExt: string) {
        // dir info
        const subDir = moment.utc().format('YYYY-MM');
        const dir = this.FTP_ROOT_FILE_PATH + subDir;

        // file info
        const fileName = nanoid(15) + '.' + fileExt;

        return {
            dir,
            newFilePath: subDir + '/' + fileName
        };
    }

    private init = async () => {
        const SSH_FTP_CONFIG = {
            host: config.ssh.host,
            port: config.ssh.port,
            username: config.ssh.username,
            password: config.ssh.password
        };
        this.sftp = new SFTPClient();
        await this.sftp.connect(SSH_FTP_CONFIG);
    }

}
