angular.module('cms.modals.add', [])
.controller('AddModalInstanceCtrl', function ($scope, $modalInstance, addTopic, addSubject) {

  $scope.addTopic = addTopic;
  
  $scope.addSubject = addSubject;

  $scope.submit = function(cancel) {
    if (cancel) {
      $modalInstance.dismiss(false);
    } else if($scope.addSubject.name) {
      $modalInstance.close(true);
    }
  };
});