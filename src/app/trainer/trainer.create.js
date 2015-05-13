angular.module('cms.trainer')
.controller('CreateTrainerController', function CreateTrainerController( $scope, $state, notifications, TrainerFactory ) {
  
  var trainer = TrainerFactory.getService();
  
  $scope.submitText = "Create";
  $scope.trainer = trainer.model;

  $scope.submit = function () {
    $scope.submitted = true;
    trainer.save()
      .then(function(model){
        notifications.showSuccess({message: "Trainer '" + model.first + "' was created" });
      })
      .catch(function(err){
        notifications.showError({message: "An error occured loading trainer " + err.statusText });
      });
  };

});