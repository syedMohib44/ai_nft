import { Router } from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { APIError } from '../../utils/error';
import { sendMail } from '../../libs/mail/mail';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { config } from '../../config';
import { JWTPAYLOAD } from '../../interface/JWTPayload';
import moment from 'moment';
import SuperAdmin from '../../entity/SuperAdmin';
import { businessRoutes } from './business.route';

const router = Router();


router.use('/business', businessRoutes);


router.post('/signup', async (req, res, next) => {
    try {
        // check if superadmin already exist in DB. There can be only 1 superadmin!
        const existingSuperadmin = await SuperAdmin.find({});
        if (existingSuperadmin.length > 0) {
            throw new APIError(400, { message: 'Superadmin exists!' });
        }

        const password = nanoid();
        console.log('Password is: ' + password);
        const hashedPassword = await bcrypt.hash(password, 10);

        const superadmin = new SuperAdmin();
        superadmin.email = req.body.email;
        superadmin.password = hashedPassword;
        await superadmin.save();

        sendMail({
            to: superadmin.email,
            text: `Your superadmin credentials for \n
            Email: ${superadmin.email}\n
            Password: ${password}`,
            subject: 'Superadmin credentials'
        }).catch(console.log);

        res.sendStatus(204);

    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const superadmin = await SuperAdmin.findOne({ email: req.body.username });
        if (!superadmin) {
            throw new APIError(401, { message: 'Invalid email or password' });
        }
        const isValid = await bcrypt.compare(req.body.password, superadmin.password);
        if (!isValid) {
            throw new APIError(401, { message: 'Invalid email or password' });
        }

        const payload: Pick<JWTPAYLOAD, 'userId' | 'typeOfUser'> = {
            userId: superadmin._id,
            typeOfUser: 'superadmin',
        };
        const token = jwt.sign(payload, config.jwt_secret, { expiresIn: config.jwt_life });
        const refreshToken = jwt.sign(payload, config.refresh_jwt_secret, { expiresIn: config.refresh_jwt_life })

        superadmin.lastLogin = moment.utc().toDate();
        superadmin.refreshToken = refreshToken;

        await superadmin.save();

        res.json({ status: 'success', data: { token, refreshToken } });

    } catch (err) {
        next(err);
    }
});

router.delete('/logout', async (req, res, next) => {
    try {
        const user = req.user as any;
        if (!user.userId) {
            res.sendStatus(401);
        }
        await SuperAdmin.updateOne({ _id: user.userId }, { $unset: { refreshToken: 1 } });

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

router.post('/token', async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            throw new APIError(401);
        }

        let decodedToken: Record<string, any>;
        try {
            // check if refresh token is valid
            decodedToken = jwt.verify(refreshToken, config.refresh_jwt_secret) as Record<string, any>;
        } catch (err) {
            throw new APIError(401);
        }

        // check the token in db
        const superadmin = await SuperAdmin.findOne({ _id: decodedToken.userId, refreshToken });
        if (!superadmin) {
            throw new APIError(401);
        }

        const payload: Pick<JWTPAYLOAD, 'userId' | 'typeOfUser'> = {
            userId: decodedToken.userId,
            typeOfUser: decodedToken.typeOfUser,
        };

        const token = jwt.sign(payload, config.jwt_secret, { expiresIn: config.jwt_life });
        res.json({ status: 'success', data: { token } });
    } catch (err) {
        next(err);
    }
});

export {
    router as superadminRoutes
};
