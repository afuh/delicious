const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(User.createStrategy()); //se puede usar esto porque se lo pasamos como plugin cuando se hace el schema

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
