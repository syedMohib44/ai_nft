import Users, { IUsers } from '../../entity/Users';
import { APIError } from '../../utils/error';
import bcryptjs from 'bcryptjs';

interface UpdateProfilePasswordDto {
    currentPassword: string;
    newPassword: string;
    userId: IUsers['_id'];
    accessToken: string;
}

export const changePassword = async ({
    currentPassword,
    newPassword,
    userId
}: UpdateProfilePasswordDto) => {
    const user = await Users.findOne({ _id: userId });
    if (!user) {
        throw new APIError(400, { message: 'User does not exist' });
    }

    const isPasswordEqual = bcryptjs.compareSync(currentPassword, user.password as string);
    if (!isPasswordEqual) {
        throw new APIError(400, { message: 'Password is incorrect' });
    }

    const newHashedPassword = bcryptjs.hashSync(newPassword, 10);
    user.password = newHashedPassword;
    await user.save();
};
