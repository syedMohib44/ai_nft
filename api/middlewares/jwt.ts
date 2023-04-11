import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { config } from '../config';
import { JWTPAYLOAD } from '../interface/JWTPayload';

passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt_secret
}, (jwtToken: JWTPAYLOAD, done: any) => {
  if (jwtToken) {
    done(null, jwtToken);
  } else {
    done(null, false);
  }
}));
