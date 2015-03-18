angular.module('cms')
.factory('MealFactory', function MealFactory($log, $q, BaseFactory, Meal){

  function MealService(data) {
    this.defaults = {
      trainer: {},
      dishes: []
    };
    this._super(data, Meal);
  }

  MealService.prototype.setTrainerId = function(trainerId) {
    this.model.trainer.id = trainerId;
  };

  MealService.prototype.setDishes = function(dishes, configurations) {
    this.model.dishes = dishes.map(function(dish){
      return dish.id;
    });
  };

  BaseFactory.extend(MealService, Meal);

  return MealService;
});