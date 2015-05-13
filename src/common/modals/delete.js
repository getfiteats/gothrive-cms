angular.module('cms.modals.delete', [])
.controller('DeleteModalInstanceCtrl', function ($scope, $modalInstance, deleteTopic, deleteSubject) {

  $scope.deleteTopic = deleteTopic;
  
  $scope.deleteSubject = deleteSubject;

  $scope.ok = function () {
    $modalInstance.close(true);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss(false);
  };

});