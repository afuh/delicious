const mongoose = require('mongoose');
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please Supply an email address'
  },
  name: {
    type: String,
    required: 'Please Supply a name',
    trim: true
  }
});

userSchema.virtual('gravatar').get(function(){
  const hash = md5(this.email);
  //https://es.gravatar.com/site/implement/images/
  return `https://gravatar.com/avatar/${hash}?=200&d=retro&r=g`;
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
