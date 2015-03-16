angular.module( 'cms.meal', [
  'ui.router'
])
.config(function config( $stateProvider ) {
  $stateProvider
    .state('createMeal', {
      url: '/meal',
      views: {
        "main": {
          controller: 'CreateMealController',
          templateUrl: 'meal/meal.tpl.html'
        }
      },
      data: { pageTitle: 'Create Meal' }
    });
});