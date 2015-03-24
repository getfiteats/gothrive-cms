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

    $scope.update = function(modelData) {
      var service = new MealFactory(modelData);
      service.update()
        .then(function(){
          notifications.showSuccess({ message: "Updated Meal: '" + modelData.name + "'"});
        })
        .catch(function(err){
          notifications.showError({ message: "Error Updating Meal: '" + modelData.name + "' " + err.statusText });
        });
    };
});
