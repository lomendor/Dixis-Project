import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Έλεγχος αν υπάρχει ήδη ο χρήστης
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Αν υπάρχει, ενημέρωση των Google στοιχείων
          user.googleId = profile.id;
          user.name = user.name || profile.displayName;
          await user.save();
          return done(null, user);
        }

        // Αν δεν υπάρχει, δημιουργία νέου χρήστη
        user = await User.create({
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id,
          role: 'user',
          status: 'active'
        });

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}); 