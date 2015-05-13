angular.module('cms.meal')
.controller('EditMealController', function EditMealController( $scope, $state, $stateParams, $timeout, notifications, User, Trainer, Delivery, NutritionTag, GooglePlacesFactory, MealFactory, DeliveryFactory) {
  
   //initialize selected options
  var meal;

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

  $scope.bodyClass = 'meal';

  $scope.submitText = "Edit";

  $scope.edit = true;

  $scope.selectedPlace = {};

  $scope.meal = MealFactory.getService().model;

  MealFactory.getServiceById($stateParams.mealId, ['brand',  {relation: 'trainerReference', scope: {include: 'trainer'}}])
    .then(function(_meal){
      meal = _meal;
      $scope.meal = meal.model;
      return NutritionTag.find().$promise;
    })
    .then(function(tags){
      $scope.tags = tags;
      $scope.tags.forEach(function(tag){
        tag.on = $scope.meal.tags[tag.id] || false;
      });
      return DeliveryFactory.modelClass.getDishesByRestaurantId({
        restaurantId: $scope.meal.brand.original.src.externalId
      }).$promise;
    })
    .then(function(dishes){
      $scope.dishes = DeliveryFactory.formatDishes(dishes);
      $scope.calculateTotal();
    })
    .catch(function(err){
      notifications.showError({message: "An error occured loading meal " + err.statusText });
    });

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
    try {
      meal.update()
      .then(function(model){
        notifications.showSuccess({message: "Meal '" + model.name + "' was updated" });
        $state.go('listMeals');
      })
      .catch(function(err){
        notifications.showError({message: "An error occured updating meal: " + err.data.error.message});
      });
    } catch(err) {
      notifications.showError({message: "An error occured updating meal: " + err});
    }
  };

  $scope.toggleTag = function(tag) {
    tag.on = !tag.on;

    if (tag.on) {
      $scope.meal.tags[tag.id] = true;
    } else {
      delete $scope.meal.tags[tag.id];
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