import bcryptjs from 'bcryptjs';

export const isValidate = async (password: string, hashedPassword: string): Promise<boolean> => {
    const isValid = await bcryptjs.compare(password, hashedPassword);

    return isValid;
};
