angular.module('cms.meal')
.controller('EditMealController', function EditMealController( $scope, $state, $stateParams, notifications, User, Trainer, Delivery, GooglePlacesFactory, MealFactory, DeliveryFactory) {
  
  MealFactory.getServiceById($stateParams.mealId, [
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
    ])
    .then(init)
    .catch(function(err){
      notifications.showError({message: "An error occured loading meal " + err.data.error.message});
    });


  function init(meal) {
    $scope.meal = meal.model;
    DeliveryFactory.modelClass.getDishesByRestaurantId({restaurantId: meal.model.brand.src[0].externalId}).$promise
      .then(function(dishes){
        $scope.dishes = DeliveryFactory.formatDishes(dishes);
        
        var editDishes = DeliveryFactory.formatDishes($scope.meal.dishes.map(function(dish){
          return dishes.filter(function(_dish){
            return _dish.src.externalId === dish.externalId;
          })[0];
        }));

        $scope.meal.dishes = $scope.meal.dishes.map(function(dish){
          var _dish = editDishes.filter(function(_dish){
            return _dish.id === dish.externalId;
          })[0];
          _dish.original.id = dish.id;
          _dish.config = dish.config;
          return _dish;
        });
      });
  }
  
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
      meal.save();
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