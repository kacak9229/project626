var express  	= require('express');
var User     	= require('../models/user');
var Story 		= require('../models/story');
var bodyParser	= require('body-parser');
var jwt			= require('jsonwebtoken');
var config 		= require('../../config.js');

// the router
var router 		= express.Router();

// secret key for token encryption
var secret 		= config.secret;

// function to create a story and save it to the database
function createStory(req, res) {

	var story = new Story({
		_creator: req.decoded.id,
		content: req.body.content
	});

	story.save(function(err) {
		if(err) {
			res.send(err);
			return;
		}

		res.json({ message: "New Story has been created!" });
	});
}

// token Creation
function createToken(user) {

	var token = jwt.sign({
		id: user._id,
		name: user.name,
		username: user.username
	}, secret, {
		expirtesInMinute: 1440
	});

	return token;
}

// Route to signup user and token creation
router.post('/signup', function(req, res) {

	var user = new User({
		name: req.body.name,
		username: req.body.username,
		password: req.body.password,
	});

	var token = createToken(user);
	user.save(function(err) {
		if(err) {
			res.send(err);
			return;
		}
		res.json({ 
			success: true,
			message: 'User has been created!',
			token: token
		});
	});
});


// Route to login the user and token creation
router.post('/login', function(req, res) {

	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user) {
		if(err) throw err;

		if(!user) {
			res.json({ message: "User does not exist"});
		} else if(user) {
			var checkPassword = user.comparePassword(req.body.password);

			if(!checkPassword) {
				res.json({ message: "Wrong password given" });
			} else {

				var token = createToken(user);

				res.json({
					success: true,
					message: "Congratulations on login",
					token: token
				});
			}
		}
	});
});

// MIDDLEWARES for authenticated user (Must cross this path to go to other route);
router.use(function(req, res, next){

	console.log("Someone has visited!");

	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	if(token) {

		jwt.verify(token, secret, function(err, decoded) {

			if(err) {
				res.status(403).send({ message: "Failed to login" });
			} else {

				req.decoded = decoded;
				next(); // Go to next matching route
			}
		});

	} else {
		res.status(403).send({ success: false, message: "No token provided" });
	}

});


// Home Route (GET: all the stories that belong to a user that created it, POST: user can create a story)
router.route('/')

	.get(function(req, res) {
		Story.find({ _creator: req.decoded.id }, function(err, story) {
			if(err) {
				res.send(err);
				return;
			}
			res.json(story);
		});
	})

	.post(createStory);




// edit a user

router.route('/:user_username')
	
	.get(function(req, res) {

		
		User.findOne(req.params.username, function(err, user) {
			if(err) {
				res.send(err);
				return;
			}
			res.json(user);
		});
	}) 

	// .put()

	.post(createStory)


// Get all all user and can follow them

router.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		if(err) {
			res.send(err);
			return;
		}
		res.json(users);
	});
});

// for getting user information for later use
router.get('/me', function(req, res) {
	res.send(req.decoded);
});


module.exports = router;