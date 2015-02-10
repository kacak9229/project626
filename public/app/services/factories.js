angular.module('MyApp')

	.factory('User', function($http, $alert, $window, $location) {


		var userFactory = {};

		userFactory.get = function(userName) {
			return $http.get('/api/' + userName);
		}



		userFactory.create = function(userData) {
			return $http.post('/api/signup', userData)
				.then(function(response) {
					$window.localStorage.setItem('token', response.data.token);
					$location.path('/');
				});
		}



		return userFactory;

	});



	// .factory('Story', function($http) {





	// })