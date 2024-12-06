const express = require('express');
const helmet = require('helmet');
const path = require("path");
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session')
require('dotenv').config();

const app = express();
const PORT = 5000;
const config = {
    COOKIE_SECRET_1: process.env.COOKIE_SECRET_1,
    COOKIE_SECRET_2: process.env.COOKIE_SECRET_2,
}
// Middleware for security
app.use(helmet());
app.use(passport.initialize());
app.use(cookieSession({
    name: 'session',
    keys: [config.COOKIE_SECRET_1, config.COOKIE_SECRET_2], // key[0] used for signin
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(passport.session())
//set cookie 
passport.serializeUser((user, done) => {
    console.log("session user",user);
    done(null, user.id)
})


//read cookies
passport.deserializeUser((user, done) => {
    done(null, user)
})

// Passport configuration
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        (accessToken, refreshToken, profile, cb) => {
            // console.log("Google login profile:", profile);

            // Simulate user retrieval or creation logic
            const user = {
                id: profile.id,
                displayName: profile.displayName,
                emails: profile.emails,
            };

            // Pass the user data to Passport
            return cb(null, user);
        }
    )
);


// Initialize Passport

// Routes
app.get('/', (req, res) => {
 
    res.send("Welcome");
});
app.get('/auth/logout', (req, res) => {
 
   req.logOut()
});
app.get('/profile', (req, res) => {
    if(!req.isAuthenticated() && !req.user){
        res.redirect("/")
    }else{
        return res.send("Hello")
    }

});
app.get('/fail', (req, res) => {
    res.send("Authentication Failed");
});

// Route to start Google authentication
app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback route
app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/fail', session: true }),
    (req, res) => {
        // Successful authentication
        res.redirect('/');
    }
);

// Serve a secret page (example for authenticated users)
app.get('/secret', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err.stack);
    res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});