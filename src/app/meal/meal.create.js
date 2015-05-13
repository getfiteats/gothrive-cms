angular.module('cms.meal')
.controller('CreateMealController', function MealController( $scope, $state, notifications, User, Trainer, Delivery, NutritionTag, GooglePlacesFactory, MealFactory, DeliveryFactory) {
  
  var meal = MealFactory.getService();
  var trainers;
  var selectOneSettings = {
    showCheckAll: false,
    showUncheckAll: false,
    smartButtonMaxItems: 30,
    dynamicTitle: true,
    selectionLimit: 1,
    enableSearch: true,
    closeOnSelect: true,
    closeOnDeselect: true,
    externalIdProp: ''
  };
  var selectMultipleSettings = {
    showCheckAll: false,
    showUncheckAll: false,
    smartButtonMaxItems: 30,
    dynamicTitle: true,
    enableSearch: true,
    closeOnSelect: true,
    closeOnDeselect: true,
    externalIdProp: ''
  };
  var dishOptionSettings = {
    showCheckAll: false,
    showUncheckAll: false,
    smartButtonMaxItems: 30,
    dynamicTitle: true,
    closeOnSelect: true,
    closeOnDeselect: true,
    externalIdProp: ''
  };

  NutritionTag.find().$promise
    .then(function(tags){
      $scope.tags = tags;
    });

  $scope.bodyClass = 'meal';

  $scope.submitText = "Create";

  $scope.selectedPlace = {};

  $scope.$watch('selectedPlace', function(newPlace){
    var placeId;

    try {
      placeId = newPlace.originalObject.place_id;
    } catch (err) {
      return;
    }

    GooglePlacesFactory.modelClass.findOne({id: placeId}).$promise
      .then(function(brand){
        return Delivery.restaurantSearch({address: brand.address.formatted}).$promise;
      })
      .then(function(restaurants){
        $scope.restaurants = DeliveryFactory.formatRestaurants(restaurants);
      })
      .catch(function(err){
        notifications.showError({message: "An error occured loading restaurants " + err});
      });
  });

  // Restaurants Dropdown
  $scope.restaurantSettings = selectOneSettings;
  $scope.restaurantTexts = {
    buttonDefaultText: "Select Restaurant"
  };

  // Dishes Dropdown
  $scope.dishSettings = selectMultipleSettings;
  $scope.dishTexts = {
    buttonDefaultText: "Select Dishes"
  };

  // Trainer Dropdown
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

  $scope.onRestaurantSelected = function(restaurant) {
    $scope.meal.dishes = [];
    DeliveryFactory.modelClass.getDishesByRestaurantId({restaurantId: restaurant.id}).$promise
      .then(function(dishes){
        $scope.dishes = DeliveryFactory.formatDishes(dishes);
      });
  };

  $scope.calculateTotal = function() {
    $scope.total = meal.calculateTotal();
  };

  $scope.submit = function submit() {
    if (!$scope.meal.trainer.id) {
      notifications.showError({message: "A trainer must be selected" });
      return;
    }

    meal.save()
      .then(function(model){
        notifications.showSuccess({message: "Meal '" + model.name + "' was created" });
        $state.go('listMeals');
      })
      .catch(function(err){
        notifications.showError({message: "An error occured saving meal: " + err.data.error.message});
      });
  };

  $scope.getDishOptions = function getDishOptions(selectionLimit) {
    var options = angular.copy(dishOptionSettings);
    options.selectionLimit = selectionLimit;
    return options;
  };

  $scope.toggleTag = function(tag) {
    tag.on = !tag.on;

    if (tag.on) {
      $scope.meal.tags[tag.id] = true;
    } else {
      delete $scope.meal.tags[tag.id];
    }
  };

  function setTrainers(trainers) {
    $scope.trainers = trainers.map(function(trainer){
      return { label: trainer.first + ' ' + trainer.last, id: trainer.id };
    });
  }


});