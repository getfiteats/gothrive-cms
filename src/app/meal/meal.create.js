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
          throw new Error("no places found");
        }
        setBrand(place[0]);
        $scope.meal.dishes = [{}];
      })
      .catch(function(err){
        notifications.showError({message: "An error occured loading place: " + err});
      });
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

  $scope.addDish = function() {
    $scope.meal.dishes.push({});
  };

  function setTrainers(trainers) {
    $scope.trainers = trainers.map(function(trainer){
      return { label: trainer.first + ' ' + trainer.last, id: trainer.id };
    });
  }

  function setBrand(place) {
    var schedule;

    $scope.meal.brand.address = place.address_components[0].long_name + ' ' + place.address_components[1].long_name;
    $scope.meal.brand.city = place.address_components[2].long_name;
    $scope.meal.brand.state = place.address_components[3].long_name;
    $scope.meal.brand.country = place.address_components[4].long_name;
    $scope.meal.brand.zip = place.address_components[5].long_name;
    $scope.meal.brand.phone = place.formatted_phone_number.replace(/[()-]| /g,'');
    //$scope.meal.brand.setGeo(place.geometry.location.lng, place.geometry.location.lat);

    if (place.opening_hours && place.opening_hours.periods) {
      schedule = [];
      place.opening_hours.periods.forEach(function(period) {
        schedule.push({day: period.open.day, startTime: period.open.time, endTime: period.close.time});
      });
      $scope.meal.brand.schedule = schedule;
    }
  }

});