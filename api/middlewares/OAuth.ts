import passport from 'passport';
import { config } from '../config';
import passportFacebook from 'passport-facebook';
import passportGoogle from 'passport-google-oauth2';
import Users, { IUsers } from '../entity/Users';

const GoogleStrategy = passportGoogle.Strategy;


passport.serializeUser<IUsers, any>((user: IUsers, done: any) => {
    done(undefined, user._id);
});

passport.deserializeUser((id: string, done) => {
    console.log('This is from desirializer===========' + id);
    Users.findOne({ _id: id }, (err: any, user: IUsers) => {
        done(err, user);
    });
});

const googleOptions: passportGoogle.StrategyOptionsWithRequest = {
    clientID: config.google.client_id,
    clientSecret: config.google.client_secret,
    callbackURL: `${config.base_url}/api/google-auth/callback`,
    passReqToCallback: true
};


passport.use(new GoogleStrategy(googleOptions, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    console.log('uisbudahf');
    Users.findOne({ google: profile.id }, (err: any, existingUser: IUsers) => {
        if (err) { return done(err); }
        if (existingUser) {
            return done(undefined, existingUser);
        }

        Users.findOne({ username: profile._json.email }, (err: any, existingEmailUser: IUsers) => {
            if (err) { return done(err); }
            if (existingEmailUser) {
                // req.flash("errors", { msg: "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings." });
                done(err);
            } else {
                const user: any = new Users();
                user.username = profile._json.email;
                user.token = { kind: 'google', accessToken, refreshToken };
                user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
                user.profile.gender = profile._json.gender;
                user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                user.profile.location = (profile._json.location) ? profile._json.location.name : '';
                user.save((err: Error) => {
                    done(err, user);
                });
            }
        });
    });
}));
