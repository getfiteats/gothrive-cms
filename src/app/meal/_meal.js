angular.module( 'cms.meal', [
  'ui.router'
])
.config(function config( $stateProvider ) {
  $stateProvider
    .state('createMeal', {
      url: '/meals/create',
      views: {
        "main": {
          controller: 'CreateMealController',
          templateUrl: 'meal/meal.tpl.html'
        }
      },
      data: { pageTitle: 'Create Meal' }
    });

  $stateProvider
    .state('listMeals', {
        url: '/meals',
        views: {
            "main": {
                controller: 'ListMealController',
                templateUrl: 'meal/meal.list.tpl.html'
            }
        },
        data: { pageTitle: 'List Meals' }
    });
});
