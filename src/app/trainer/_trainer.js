angular.module( 'cms.trainer', [
  'ui.router'
])
.config(function config( $stateProvider ) {
  $stateProvider
    .state('createTrainer', {
      url: '/trainers',
      views: {
        "main": {
          controller: 'CreateTrainerController',
          templateUrl: 'trainer/trainer.tpl.html'
        }
      },
      data: { pageTitle: 'Create Meal' }
    });

  $stateProvider
    .state('editTrainer', {
      url: '/trainers/:trainerId',
      views: {
        "main": {
          controller: 'EditTrainerController',
          templateUrl: 'trainer/trainer.tpl.html'
        }
      },
      data: { pageTitle: 'Edit Meal' }
    });
});