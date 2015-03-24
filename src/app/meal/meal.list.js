angular.module('cms.meal')
.controller('ListMealController', function MealController( $scope, $state, notifications, User, MealFactory ) {
    var MOCK_MEALS = [
      {name: "TestDish1", brand: {name: "TestBrand1"}, price: 8.50, tags: ["gluten-free", "sugar-free"], active: true},
      {name: "TestDish2", brand: {name: "TestBrand2"}, price: 9.50, tags: ["gluten-free", "sugar-free"], active: false},
      {name: "TestDish3", brand: {name: "TestBrand3"}, price: 10.50, tags: ["gluten-free", "sugar-free"], active: true},
      {name: "TestDish4", brand: {name: "TestBrand4"}, price: 11.50, tags: ["gluten-free", "sugar-free"], active: false},
      {name: "TestDish5", brand: {name: "TestBrand5"}, price: 12.50, tags: ["gluten-free", "sugar-free"], active: true}
    ];

    $scope.meals = MOCK_MEALS;

    MealFactory.modelClass.find({filter: {
      include:[
        {
          relation: 'brand'
        },
        {
          relation: 'dishes',
          scope: {
            include: {
              relation: 'dish'
            }
          }
        }
      ]}
    }).$promise
      .then(function(meals){
        console.log('mealss', meals);
        $scope.meals = meals || MOCK_MEALS;
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
