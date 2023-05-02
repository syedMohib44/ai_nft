import passport from 'passport';
import { config } from '../config';
import passportGoogle from 'passport-google-oauth2';
import Users, { IUsers } from '../entity/Users';
import Web3 from 'web3';
import { APIError } from '../utils/error';

const GoogleStrategy = passportGoogle.Strategy;

//https://itecnote.com/tecnote/node-js-how-to-make-passportjs-google-login-oauth-work-with-jwt-instead-of-creating-session-through-serialize-deserialize-method/
// passport.serializeUser<IUsers, any>((user: IUsers, done: any) => {
//     console.log('Serialize');
//     done(null, user._id);
// });

// passport.deserializeUser((id: string, done) => {
//     console.log('This is from desirializer===========' + id);
//     Users.findOne({ _id: id }, (err: any, user: IUsers) => {
//         done(err, user);
//     });
// });

const googleOptions: passportGoogle.StrategyOptionsWithRequest = {
    clientID: config.google.client_id,
    clientSecret: config.google.client_secret,
    callbackURL: `${config.base_url}/api/google-auth/callback`,
    passReqToCallback: true
};


passport.use(new GoogleStrategy(googleOptions, async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
        const existingUser = await Users.findOne({ google: profile.id });
        if (existingUser)
            return done(null, existingUser);

        const existingEmailUser = await Users.findOne({ username: profile._json.email })
        if (existingEmailUser) {
            return done(null, null);
        } else {
            //May have to look into below link as implementation is outdated.
            //https://www.developerhandbook.com/blog/passportjs/how-to-add-passportjs-google-oauth-strategy/
            const isAddress = Web3.utils.isAddress(req.query.state);
            if (!isAddress)
                throw new APIError(400, { message: 'Invalid address' });
            if (!profile._json.email_verified)
                throw new APIError(400, { message: 'Email not verified' });
            const user: IUsers = new Users();
            user.username = profile._json.email;
            user.address = req.query.state;
            user.token = { kind: 'google', accessToken, refreshToken };
            user.firstName = profile.name.givenName;
            user.google = profile.id;
            user.lastName = profile.name.familyName;
            user.typeOfUser = 'user';
            user.isActive = true;
            user.profilePic = profile._json.picture;
            await user.save();
            done(null, user);
        }
    }
    catch (err) {
        console.log(err);
        done(err);
    }
}));