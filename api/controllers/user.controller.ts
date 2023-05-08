import { Request, Response, NextFunction } from 'express';
import { authenticateUser, logoutUser, refreshToken } from '../services/auth-service/login.service';
import { AddAuthenticationDto } from '../dto/auth/authenticationDto';
//import { forgotEmail } from '../services/auth-service/forgotEmail.service';
//import { forgotPassword } from '../services/auth-service/forgotPassword.service';
//import { resetPassword } from '../services/auth-service/resetPassword.service';
import Joi from '@hapi/joi';
import { validate } from '../libs/validator/validate';
import { IUserRequest } from '../interface/IUserRequest';
import { changePassword } from '../services/auth-service/changePassword.service';
import { forgotPassword } from '../services/auth-service/forgotPassword.service';
import { findUserByAddress } from '../services/auth-service/findUserByAddress.service';
import { resetPassword } from '../services/auth-service/resetPassword.service';
//import { changePassword } from '../services/auth-service/changePassword.service';
//import { changeEmail } from '../services/auth-service/changeEmail.service';
//import { updateBlackListedSidebarMenus } from '../services/sidebar-service/updateBlackListedSidebarMenus.service';
//import { showBlacklistedMenus } from '../services/sidebar-service/showBlacklistedMenus.service';

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);
        const addAuthenticationDto: AddAuthenticationDto = {
            address: req.body.address,
            password: req.body.password
        };
        const token = await authenticateUser(addAuthenticationDto);
        res.status(200).json({
            data: token
        });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req: IUserRequest, res: Response) => {
    await logoutUser(req.user.userId);
    res.sendStatus(204);
};
// export const postForgotEmail = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await forgotEmail({
//             phone: req.body.phone,
//             googleCaptcha: req.body.g_recaptcha_response,
//             ipaddress: req.ip
//         });

//         res.status(200).json({
//             status: 'success',
//             data: 'The registered email address is sent via SMS. Please check your phone message box.'
//         });
//     } catch (err) {
//         next(err);
//     }
// };

export const postForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await forgotPassword({
            username: req.body.username,
            googleCaptcha: req.body.g_recaptcha_response,
            ipAddress: req.ip
        });

        res.status(200).json({
            status: 'success',
            data: 'Email sent for password change'
        });
    } catch (err) {
        next(err);
    }
};

export const getUserExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await findUserByAddress(req.params.address);
        console.log(result);
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

export const tokenRefresh = async (req: Request, res: Response, next: NextFunction) => {

    const oldToken = req.body.refreshToken;
    try {
        const token = await refreshToken(oldToken);
        res.status(200).json({
            data: { token }
        });
    } catch (err) {
        next(err);
    }
};

export const postVerifyForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await resetPassword(req.body.code, req.body.newPassword, req.body.confirmPassword);

        res.status(200).json({
            status: 'success',
            data: 'Password has been updated'
        });
    } catch (err) {
        return next(err);
    }
};

export const postChangePassword = async (req: IUserRequest, res: Response) => {
    const schema = Joi.object({
        currentPassword: Joi.string()
            .required(),
        newPassword: Joi.string()
            .min(8)
            .required(),
        confirmPassword: Joi.ref('newPassword')
    });

    const { error } = validate(schema, req.body);
    if (error) {
        throw error;
    }

    await changePassword({
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
        userId: req.user.userId,
        accessToken: req.headers.authorization?.split(' ')[1] as string
    });

    res.sendStatus(204);
};

// export const postChangeEmail = async (req: IUserRequest, res: Response) => {
//     const schema = Joi.object({
//         currentPassword: Joi.string()
//             .required(),
//         newEmail: Joi.string()
//             .email()
//             .required()
//     });

//     const { error } = validate(schema, req.body);
//     if (error) {
//         throw error;
//     }

//     await changeEmail({
//         currentPassword: req.body.currentPassword,
//         newEmail: req.body.newEmail,
//         userId: req.user.userId,
//         accessToken: req.headers.authorization?.split(' ')[1] as string
//     });

//     res.sendStatus(204);
// };
