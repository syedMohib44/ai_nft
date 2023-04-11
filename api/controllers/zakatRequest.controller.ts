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
import { AddZakatRequestDto } from '../dto/zakat-request/addAcceptorDto';
import { insertZakatRequest } from '../services/zakat-request-service/insertRequest.service';
//import { changePassword } from '../services/auth-service/changePassword.service';
//import { changeEmail } from '../services/auth-service/changeEmail.service';
//import { updateBlackListedSidebarMenus } from '../services/sidebar-service/updateBlackListedSidebarMenus.service';
//import { showBlacklistedMenus } from '../services/sidebar-service/showBlacklistedMenus.service';

export const postZakatRequest = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const addZakatRequestDto: AddZakatRequestDto = {
            address: req.user.address,
            amount: req.body.amount,
            duration: req.body.duration,
            user: req.user.userId,
            identityCard: req.file
        }
        await insertZakatRequest(addZakatRequestDto);
        res.status(200).json({
            data: "Zakat Request initiated"
        });
    } catch (err) {
        next(err);
    }
};