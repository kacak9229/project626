angular.module('MyApp', ['ngRoute', 'ui.bootstrap'])
	
	.config(function($routeProvider, $locationProvider) {

		$routeProvider

			.when('/', {
				templateUrl: 'app/views/home.html',
				controller: 'HomeController'

			})

			.when('/signup', {
				templateUrl: 'app/views/signup.html',
				controller: 'SignUpController'
			});

		$locationProvider.html5Mode(true);	
		
	}) 