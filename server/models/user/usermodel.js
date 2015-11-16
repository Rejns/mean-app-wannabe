var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var userSchema = new Schema({
  username    : String,
  password	  : String,
  access	  : String,
}, {collection: 'users'});

userSchema.plugin(mongoosePaginate);

mongoose.model('User', userSchema);
var User = mongoose.model('User');

module.exports = User;