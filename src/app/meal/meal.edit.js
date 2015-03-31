angular.module('cms.meal')
.controller('EditMealController', function MealController( $scope, $state, $stateParams, notifications, User, Trainer, Delivery, NutritionTag, GooglePlacesFactory, MealFactory) {

    //initialize selected options
    var meal = MealFactory.getService();
    $scope.meal = meal.model;
    MealFactory.getServiceById($stateParams.mealId, ['brand',  {relation: 'trainerReference', scope: {include: 'trainer'}}])
      .then(init)
      .catch(function(err){
        notifications.showError({message: "An error occured loading meal " + err.statusText });
      });

    var trainers;
    var trainerSettings = {
      showCheckAll: false,
      showUncheckAll: false,
      smartButtonMaxItems: 30,
      dynamicTitle: true,
      selectionLimit: 1,
      enableSearch: true,
      closeOnSelect: true,
      closeOnDeselect: true
    };

    $scope.bodyClass = 'meal';

    $scope.submitText = "Edit";

    $scope.selectedPlace = {};

    // Trainer Dropdown
    $scope.trainerSettings = trainerSettings;
    $scope.trainerTexts = {
      buttonDefaultText: "Select Trainer"
    };

    $scope.trainers = [];

    Trainer.find().$promise
      .then(setTrainers)
      .catch(function(err){
        notifications.showError({message: "An error occured loading trainers " + err.statusText });
      });

    function init(mealService) {
      $scope.meal = meal.model = mealService.model;
      if ($scope.meal.trainerReference) {
        $scope.meal.trainer = {
          label: $scope.meal.trainerReference.trainer.first + ' ' + $scope.meal.trainerReference.trainer.last,
          id: $scope.meal.trainerReference.trainer.id,
          quote: $scope.meal._trainerReference.quote
        };
      }


      NutritionTag.find().$promise
        .then(function(tags){
          $scope.tags = tags;
          if ($scope.meal._nutritionTagReferences) {
            var activeTags = _.pluck($scope.meal._nutritionTagReferences, 'nutritionTagId');
            $scope.tags.forEach(function(tag) {
              if (activeTags.indexOf(tag.id) !== -1) {
                tag.active = true;
                $scope.meal.tags[tag.id] = true;
              }
            });
          }
        });
    }


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

    $scope.toggleTag = function(tag) {
      tag.active = !tag.active;

      if (tag.active) {
        $scope.meal.tags[tag.id] = true;
      } else {
        delete $scope.meal.tags[tag.id];
      }
    };

    $scope.addDish = function addDish() {
      $scope.meal.dishes.push({});
    };

    $scope.removeDish = function removeDish(index) {
      if (index > -1 && $scope.meal.dishes.length > 1) {
        $scope.meal.dishes.splice(index, 1);
      }
    };

    $scope.submit = function () {
      $scope.submitted = true;
      if (!$scope.meal.trainer.id) {
        notifications.showError({message: "A trainer must be selected" });
        return;
      }

      meal.update()
        .then(function(model){
          notifications.showSuccess({message: "Meal '" + model.name + "' was updated" });
        })
        .catch(function(err){
          notifications.showError({message: "An error occured updating meal " + err.statusText });
        });
    };


    function setTrainers(trainers) {
    $scope.trainers = trainers.map(function(trainer){
      return { label: trainer.first + ' ' + trainer.last, id: trainer.id };
    });
  }

});
