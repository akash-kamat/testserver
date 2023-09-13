const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors')
const app = express();

// Connect to your MongoDB databa

// Configure express-session and connect-mongodb-session for session storage
app.use(
    session({
        secret: 'code with me', // Replace with a strong session secret
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // Session will expire after 24 hours
        },
    })
);
app.use(cors({
    origin: ["http://localhost:3000", "https://taponline.netlify.app"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport.js to use Google OAuth 2.0 strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: '679498504436-s1pmgvld0jcr67ngm9v8e1bl7v20980j.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: '/auth/google/callback', // Replace with your callback URL
        },
        (accessToken, refreshToken, profile, done) => {
            done(null, profile);
            // Store or retrieve user information from your database
            // Here you can save user data to MongoDB, for example
            // User.findOneAndUpdate({ googleId: profile.id }, { name: profile.displayName }, { upsert: true, new: true }, (err, user) => done(err, user));
        }
    )
);

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from session
passport.deserializeUser((obj, done) => {
    done(null, obj);
    // Retrieve user data from your database
    // User.findById(id, (err, user) => done(err, user));
});

// Define your authentication routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/failed' }),
    (req, res) => {
        // Successful authentication, redirect to a success page
        res.redirect('http://localhost:3000');
    }
);

app.get('/dashboard', (req, res) => {
    // Access user information through req.user
    // For example, req.user.displayName, req.user.email, etc.
    res.send(`Welcome, ${req.user.displayName}!`);
});

app.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            //   cookies: req.cookies
        });
    }
});


// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
