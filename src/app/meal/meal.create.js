angular.module('cms.meal')
.controller('CreateMealController', function MealController( $scope, $state, User ) {
  
  $scope.submitText = "Create";

  $scope.selectedRestaurant = [];

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
  
});