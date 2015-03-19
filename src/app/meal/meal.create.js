angular.module('cms.meal')
.controller('CreateMealController', function MealController( $scope, $state, notifications, User, Trainer, Delivery, GooglePlacesFactory, MealFactory, DeliveryFactory) {
  
  var meal = MealFactory.getService();
  var trainers;
  var selectOneSettings = {
    showCheckAll: false,
    showUncheckAll: false,
    smartButtonMaxItems: 30,
    dynamicTitle: true,
    selectionLimit: 1,
    enableSearch: true,
    externalIdProp: ''
  };
  var selectMultipleSettings = {
    showCheckAll: false,
    showUncheckAll: false,
    smartButtonMaxItems: 30,
    dynamicTitle: true,
    enableSearch: true,
    externalIdProp: ''
  };
  var dishOptionSettings = {
    showCheckAll: false,
    showUncheckAll: false,
    smartButtonMaxItems: 30,
    dynamicTitle: true,
    externalIdProp: ''
  };

  $scope.submitText = "Create";

  $scope.selectedPlace = {};

  $scope.$watch('selectedPlace', function(newPlace){
    var placeId;

    try {
      placeId = newPlace.originalObject.place_id;
    } catch (err) {
      return;
    }

    GooglePlacesFactory.modelClass.details({placeId: placeId}).$promise
      .then(function(place){
        if (!place.length) {
          notifications.showError({message: "An error occured loading place"});
          return;
        }
        var address = GooglePlacesFactory.formatAddress(place[0].address_components);
        var deliveryAddress = address.address + ',' + address.zip;
        return Delivery.restaurantSearch({address: deliveryAddress}).$promise;
      })
      .then(function(restaurants){
        $scope.restaurants = DeliveryFactory.formatRestaurants(restaurants);
      })
      .catch(function(err){
        notifications.showError({message: "An error occured loading restaurants " + err});
      });
  });

  // Restaurants Dropdown
  $scope.selectedRestaurant = {};
  $scope.restaurantSettings = selectOneSettings;
  $scope.restaurantTexts = {
    buttonDefaultText: "Select Restaurant"
  };

  // Dishes Dropdown
  $scope.selectedDishes = [];
  $scope.dishes = [
    { label: 'Sandwich', id: "N1" },
    { label: 'Burger', id: "N2" },
    { label: 'Milk', id: "N3" }
  ];
  $scope.dishSettings = selectMultipleSettings;
  $scope.dishTexts = {
    buttonDefaultText: "Select Dishes"
  };

  // Trainer Dropdown
  $scope.selectedTrainer = {};
  $scope.trainerSettings = selectOneSettings;
  $scope.trainerTexts = {
    buttonDefaultText: "Select Trainer"
  };

  $scope.trainers = [];
  
  $scope.meal = meal.model;

  Trainer.find().$promise
    .then(setTrainers)
    .catch(function(err){
      notifications.showError({message: "An error occured loading trainers " + err.statusText });
    });

  $scope.loadTags = function(query) {
    console.log('$query', query);
  };

  $scope.onRestaurantSelected = function(restaurant) {
    DeliveryFactory.modelClass.getDishesByRestaurantId({restaurantId: restaurant.id}).$promise
      .then(function(dishes){
        $scope.dishes = DeliveryFactory.formatDishes(dishes);
      });
  };

  $scope.onDishSelected = function(dish) {

  };

  $scope.submit = function submit() {
    if (!$scope.selectedTrainer) {
      notifications.showError({message: "A trainer must be selected" });
      return;
    }
    try {
      //meal.save();
    } catch(err) {

    }
  };

  $scope.getDishOptions = function getDishOptions(selectionLimit) {
    var options = angular.copy(dishOptionSettings);
    options.selectionLimit = selectionLimit;
    return options;
  };

  function setTrainers(trainers) {
    $scope.trainers = trainers.map(function(trainer){
      return { label: trainer.first + ' ' + trainer.last, id: trainer.id };
    });
  }


});