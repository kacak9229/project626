angular.module('MyApp')

	.controller('HomeController', function($scope, $location) {

		$scope.data = "Hello Angular";
	})



	.controller('ModalController', function($scope, $location, $modal, $log) {

		

		$scope.open = function (size) {

			var modalInstance = $modal.open({
				templateUrl: 'app/views/singleWrite.html',
				controller: function() {


				},
				size: size
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};


		$scope.status = {
			isopen: false
		};

		$scope.toggled = function(open) {
			$log.log('Dropdown is now: ', open);
		};

		$scope.toggleDropdown = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.status.isopen = !$scope.status.isopen;
		};
	})

