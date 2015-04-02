angular.module('cms.meal')
.controller('ListMealController', function MealController( $scope, $state, notifications, User, MealFactory ) {

    MealFactory.modelClass.find({filter: {
        include:['brand']
      }
    }).$promise
      .then(function(meals){
        $scope.meals = meals;
      })
      .catch(function(err){
        notifications.showError({message: "An error occurred loading meals " + err});
      });

    $scope.update = function(meal) {
      meal.$save()
        .then(function(){
          notifications.showSuccess({ message: "Updated Meal: '" + meal.name + "'"});
        })
        .catch(function(err){
          notifications.showError({ message: "Error Updating Meal: '" + meal.name + "' " + err.statusText });
        });
    };
});
