const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");


passport.use(
  new GoogleStrategy(
    {
      clientID: "679498504436-s1pmgvld0jcr67ngm9v8e1bl7v20980j.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
