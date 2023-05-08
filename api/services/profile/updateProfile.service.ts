import { config } from "../../config";
import { UpdateProfileDto } from "../../dto/user/UpdateProfileDto";
import Users, { IUsers } from "../../entity/Users"
import { FileOperation } from "../../libs/fileOperation";
import { APIError } from "../../utils/error";


const updateUser = async (user: IUsers, data: UpdateProfileDto) => {
    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;

    if (data.profilePic) {
        const fileOp = new FileOperation();
        if (user.profilePic)
            fileOp.deleteFile(user.profilePic);
        const image = fileOp.fastUploadFile(data.profilePic);
        user.profilePic = image;
    }

    await user.save();
};

export const updateProfile = async (_id: string, profile: UpdateProfileDto) => {
    const user = await Users.findOne({ _id });
    if (!user)
        throw new APIError(404, { message: 'User cannot be updated' });

    await Promise.all([
        updateUser(user, profile)
    ]);
}