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
      .then(function(place){
        $scope.meal.brand = place;
        $scope.meal.dishes = [{}];
      })
      .catch(function(err){
        notifications.showError({message: "An error occured loading place: " + err});
      });
  });

  $scope.$watch('selectedParent', function(newParent){
    if (!newParent) {
      $scope.selectedPlace = {};
      $scope.meal.brand = {};
      return;
    }
    $scope.meal.parentId = newParent.originalObject.id;
    $scope.meal.brand = newParent.originalObject.brand;
  });

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


  $scope.submit = function submit() {
    if (!$scope.meal.trainer.id) {
      notifications.showError({message: "A trainer must be selected" });
      return;
    }

    meal.save()
      .then(function(model){
        notifications.showSuccess({message: "Meal '" + model.name + "' was created" });
      })
      .catch(function(err){
        notifications.showError({message: "An error occured saving meal: " + err.data.error.message});
      });
  };

  $scope.toggleTag = function(tag) {
    tag.active = !tag.active;

    if (tag.active) {
      $scope.meal.tags[tag.id] = true;
    } else {
      delete $scope.meal.tags[tag.id];
    }
  };

  $scope.addDish = function() {
    $scope.meal.dishes.push({});
  };

  function setTrainers(trainers) {
    $scope.trainers = trainers.map(function(trainer){
      return { label: trainer.first + ' ' + trainer.last, id: trainer.id };
    });
  }

});