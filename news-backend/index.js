'use strict';
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
const cors = require('cors');
const passport = require('passport');
const { Strategy } = require('passport-linkedin-oauth2');
const { LINKEDIN_API_KEY, LINKEDIN_SECRET_KEY, SESSION_SECRET } = process.env;
const session = require('express-session');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
  })
);
passport.use(
  new Strategy(
    {
      clientID: LINKEDIN_API_KEY,
      clientSecret: LINKEDIN_SECRET_KEY,
      callbackURL: '/return',
      scope: ['r_emailaddress', 'r_liteprofile'],
      state: true,
    },
    (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile);
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});
app.use(
  require('express-session')({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.initialize());
app.use(passport.session());

require('./routes/index')(app);

const db = require('./models');
db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Models Synced');
  })
  .catch((err) => console.log(err));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const PORT = 5000;
app.listen(process.env.PORT || PORT);
console.log('Server Listening on ' + PORT);
