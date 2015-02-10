angular.module('MyApp')

	.controller('SignUpController', function($scope, User) {

		
		// sign up the user
		$scope.signup = function() {

			User.create({
				name: $scope.name,
        		username: $scope.username,
        		password: $scope.password
			});
				
		};


	});
