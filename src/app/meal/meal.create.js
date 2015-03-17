angular.module('cms.meal')
.controller('CreateMealController', function MealController( $scope, $state, User ) {
  
  $scope.submitText = "Create";
  $scope.selectedRestaurant = [];
  $scope.selectedDishes = [];

  $scope.restaurants = [
    { label: "Red Rooster" , id: "1" },
    { label: "El Pollo Loco" , id: "2" },
    { label: "Long title for a restaurant name" , id: "3" }
  ];

  $scope.restaurantSettings = {
    showCheckAll: false,
    showUncheckAll: false,
    smartButtonMaxItems: 30,
    dynamicTitle: false,
    selectionLimit: 1,
    enableSearch: true
  };

  $scope.restaurantTexts = {
    buttonDefaultText: "Select Restaurant"
  };

  $scope.dishes = [
    { label: 'Sandwich', id: "N1" },
    { label: 'Burger', id: "N2" },
    { label: 'Milk', id: "N3" }
  ];
  
  $scope.dishSettings = {
    showCheckAll: false,
    showUncheckAll: false,
    smartButtonMaxItems: 30,
    dynamicTitle: false,
    enableSearch: true
  };

  $scope.dishTexts = {
    buttonDefaultText: "Select Dishes"
  };

  $scope.meal = {};

  $scope.loadTags = function(query) {
    console.log('$query', query);
  };

});