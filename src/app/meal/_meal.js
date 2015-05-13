angular.module( 'cms.meal', [
  'ui.router',
  'angular-loading-bar'
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
      data: { 
        pageTitle: 'Create Meal',
        bodyClass: 'meals'
      }
    });

  $stateProvider
    .state('editMeal', {
      url: '/meals/:mealId',
      views: {
        "main": {
          controller: 'EditMealController',
          templateUrl: 'meal/meal.tpl.html'
        }
      },
      data: { 
        pageTitle: 'Edit Meal',
        bodyClass: 'meals'
      }
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
        data: { 
          pageTitle: 'List Meals',
          bodyClass: 'meals'
        }
    });
});
