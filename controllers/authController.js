const passport = require('passport');
const mongoose = require('mongoose');
const promisify = require('es6-promisify');
const crypto = require('crypto'); //nodejs module
const User = mongoose.model('User');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Your are now logged out! 🍵');
  res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
  //firs check if the user is authenticated
  if(req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'You must be logged in to do that!');
  res.redirect('/login');
}

exports.forgot = async (req, res) => {
  // 1. See if a user with that email exists
  const user = await User.findOne({ email: req.body.email });
  if(!user) {
    req.flash('error', 'No account with that email exists');
    return res.redirect('/login');
  }
  // 2. Set reset tokens and expiry on their accout
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000 // 1 hour from now
  await user.save();
  // 3. Send them an email with the token
  /** Sacar esto ehhhh!!! **/
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  req.flash('success', `You have been emailed a password reset link ${resetURL}`)
  // 4. redirect to login page
  res.redirect('/login');
}

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() } //$gt: greather than 
  });
  if(!user) {
    req.flash('error', 'Password reset is invalid or has expired')
    return res.redirect('/login');
  }
  // if there is a user, show the res password form
  res.render('reset', { title: 'Reset your Password' });
}

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body["password-confirm"]) return next();
  req.flash('error', 'Password do not match!');
  res.redirect('back');
}

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if(!user) {
    req.flash('error', 'Password reset is invalid or has expired')
    return res.redirect('/login');
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('success', 'Your password has been reset! You are now logged in!');
  res.redirect('/');
}
