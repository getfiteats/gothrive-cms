angular.module('cms.trainer')
.controller('EditTrainerController', function CreateTrainerController( $scope, $state, $stateParams, notifications, TrainerFactory ) {
  
  $scope.submitText = "Create";

  TrainerFactory.getServiceById($stateParams.trainerId)
    .then(init)
    .catch(function(err){
      notifications.showError({message: "An error occured loading trainer " + err.statusText });
    });

  function init(trainer) {

    $scope.trainer = trainer.model;

    $scope.submit = function () {
      $scope.submitted = true;
      trainer.update()
        .then(function(model){
          notifications.showSuccess({message: "Trainer '" + model.first + "' was updated" });
        })
        .catch(function(err){
          notifications.showError({message: "An error occured updating trainer " + err.statusText });
        });
    };
  }
});