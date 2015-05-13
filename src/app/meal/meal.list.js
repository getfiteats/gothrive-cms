angular.module('cms.meal')
.controller('ListMealController', function MealController( $scope, $state, notifications, User, MealFactory ) {

    MealFactory.modelClass.find({filter: {
        include:['brand', {relation: 'nutritionTagReferences', scope: { include: 'nutritionTag'}}],
        where: {deleted: false}
      }
    }).$promise
      .then(function(meals){
        meals.forEach(function(meal){
          meal.tags = meal.nutritionTagReferences.map(function(nutritionTagReference){
            return nutritionTagReference.nutritionTag.name;
          });
        });
        $scope.meals = meals;
      })
      .catch(function(err){
        notifications.showError({message: "An error occurred loading meals " + err});
      });

    $scope.update = function(meal) {
      // TODO: Find out why brand is being deleted after saving
      var brandName = meal.brand.name;
      meal.$save()
        .then(function(){
          notifications.showSuccess({ message: "Updated Meal: '" + meal.name + "'"});
          meal.brand = {
            name: brandName
          };
        })
        .catch(function(err){
          notifications.showError({ message: "Error Updating Meal: '" + meal.name + "' " + err.statusText });
        });
    };

    $scope.delete = function(meal, index) {
      meal.deleted = true;
      $scope.update(meal);
      if (index > -1) {
        $scope.meals.splice(index, 1);
      }
    };
});
