const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const passportSetup = require("./passport");
const passport = require("passport");
// const authRoute = require("./routes/auth");
const app = express();

app.use(
  cookieSession({ name: "session", keys: ["taponline"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://tapiotest.netlify.app"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// app.use("/auth", authRoute);

const CLIENT_URL = "http://localhost:3000/";

app.get("/auth/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
  }
});

app.get("/auth/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

app.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/auth/login/failed",
  })
);



app.listen("3002", () => {
  console.log("Server is running!");
});
