var app = angular.module('app', ['ngNotificationsBar']);
app.config(['notificationsConfigProvider', function(notificationsConfigProvider){
	notificationsConfigProvider.setHideDelay(3000);
	notificationsConfigProvider.setAutoHide(true);
}]);

app.controller('main', function ($scope, notifications) {
	$scope.showError = function () {
		notifications.showError('Oops! Something bad just happend!');
	};

	$scope.showWarning = function () {
		notifications.showWarning('Hey! Take a look here..');
	};

	$scope.showSuccess = function () {
		notifications.showSuccess('Congrats! Life is great!');
	};

});
