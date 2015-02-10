var mongoose	= require('mongoose');
var bcrypt		= require('bcrypt-nodejs');

// creating user Schema
var UserSchema	= mongoose.Schema({

	name: String,
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true, select: false }

});



// Hashing the password
UserSchema.pre('save', function(next) {

	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, function(err, hash) {
		if(err) {
			return next(err);
		}

		user.password = hash;
		next();

	});
});

// custom method for comparing password

UserSchema.methods.comparePassword = function(password) {

	var user = this;

	return bcrypt.compareSync(password, user.password);

}


module.exports = mongoose.model('User', UserSchema);