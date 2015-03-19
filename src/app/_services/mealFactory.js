angular.module('cms')
.factory('MealFactory', function MealFactory($log, $q, BaseFactory, Meal){

  function MealService(data) {
    this.defaults = {
      trainer: {},
      dishes: [],
      summary: ''
    };
    this._super(data, Meal);
  }

  MealService.prototype.toStorageSchema = function() {
    var model = {};
    model.dishes = this.model.selectedDishes.map(function(dish){
      return dish.id;
    });
    model.trainer.id = this.model.selectedTrainer.id;
    return model;
  };

  BaseFactory.extend(MealService, Meal);

  return MealService;
});