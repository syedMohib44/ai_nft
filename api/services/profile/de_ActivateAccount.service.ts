import Users from "../../entity/Users";

export const de_ActivateAccount = async (_id: string, isActive: boolean) =>
    await Users.findByIdAndUpdate({ _id }, { isActive });
