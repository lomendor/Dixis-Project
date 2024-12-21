import express from 'express';
import cors from 'cors';
// import passport from 'passport';
import session from 'express-session';
// import './config/passport.js';  // Εισαγωγή της διαμόρφωσης του Passport

const app = express();

// CORS
app.use(cors({
  origin: function(origin, callback) {
    // Επιτρέπουμε requests χωρίς origin (πχ. Postman)
    if (!origin) return callback(null, true);
    
    // Επιτρέπουμε όλα τα localhost URLs
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Session middleware (απαραίτητο για το Passport)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 ώρες
  }
}));

// Passport middleware - Προσωρινά απενεργοποιημένο
/*
app.use(passport.initialize());
app.use(passport.session());
*/

// Υπόλοιπο middleware και routes...

export default app; 