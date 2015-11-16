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

userSchema.pre('save', function(next) {
    var user = this;

    // generate a salt with factor 10
    bcrypt.genSalt(10, function(err, salt) {
        //if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            //if (err) return next(err);
         
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

//instance methods
//delete password property when converting mongoose model to json for response
userSchema.methods.toJSON = function() {
  var obj = this.toObject()
  delete obj.password
  return obj
}

userSchema.methods.comparePassword = function(candidatePassword, cb) {
	    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
	        //if (err) return cb(err);
	        cb(isMatch);
	    });
};

mongoose.model('User', userSchema);
var User = mongoose.model('User');

module.exports = User;