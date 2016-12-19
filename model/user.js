var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');          //for hashing password


var UserSchema = mongoose.Schema({

  username : {
    type: String,
    index:true
  },
  password: {
    type: String
  },
  email : {
    type: String
  },
  name : {
    type: String
  }
});

var User = module.exports = mongoose.model('User', UserSchema);          //to access outside of file; mongoose.model(modelName, userSchema Variable)

module.exports.createUser = function(newUser, callback){

  var bcrypt = require('bcryptjs');
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;                                   //setting password to new hashed one
        newUser.save(callback);                                    //saving user in db
    });
});
}

module.exports.getUserByUsername = function(username, callback){
  var query = {username:username};
  User.findOne(query, callback);                             //queries the username in the db

}

//getUserById used to login
module.exports.getUserById = function(username, callback){
  User.findById(id, callback);                             //queries the username in the db

}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if(err) throw err;
    callback(null, isMatch);
});
}
