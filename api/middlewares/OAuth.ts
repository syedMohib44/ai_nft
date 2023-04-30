import passport from 'passport';
import { config } from '../config';
import passportGoogle from 'passport-google-oauth2';
import Users, { IUsers } from '../entity/Users';

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

const googleOptions: passportGoogle.StrategyOptions = {
    clientID: config.google.client_id,
    clientSecret: config.google.client_secret,
    callbackURL: `${config.base_url}/api/google-auth/callback`
};


passport.use(new GoogleStrategy(googleOptions, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    console.log(profile, 'uisbudahf');
    try {
        const existingUser = await Users.findOne({ google: profile.id });
        if (existingUser) {
            // console.log('This is existing ', existingUser);
            return done(null, existingUser);
        }

        const existingEmailUser = await Users.findOne({ username: profile._json.email })
        if (existingEmailUser) {
            // console.log(existingEmailUser)
            // req.flash("errors", { msg: "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings." });
        } else {
            //May have to look into below link as implementation is outdated.
            //https://www.developerhandbook.com/blog/passportjs/how-to-add-passportjs-google-oauth-strategy/
            const user: IUsers = new Users();
            user.username = profile._json.email;
            user.address = '21';
            user.password = '221323423134'
            user.token = { kind: 'google', accessToken, refreshToken };
            user.firstName = profile.name.givenName;
            user.google = profile.id;
            user.lastName = profile.name.familyName;
            user.typeOfUser = 'user';
            user.isActive = true;
            user.profilePic = profile._json.picture;
            user.phone = (profile._json.location) ? profile._json.location.name : '';
            await user.save();
            done(null, user);
        }
    }
    catch (err) {
        console.log(err);
        done(err);
    }
}));