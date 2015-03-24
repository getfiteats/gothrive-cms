angular.module('cms')
.factory('MealFactory', function MealFactory($log, $q, BaseFactory, Meal, DeliveryFactory){

  function MealService(data) {
    this.defaults = {
      trainer: {},
      dishes: [],
      brand: {},
      summary: '',
      tags: {}
    };
    this._super(data, Meal);
  }

  MealService.prototype.toStorageSchema = function() {
    var model = angular.copy(this.model);

    model._dishes = model.dishes;
    model.ingredients = this.model.ingredients.map(function(ingredient){
      return ingredient.text;
    });
    model._nutritionTags = Object.keys(model.tags).map(function(tagId){
      var tag = model.tags[tagId];
      return { id: tagId };
    });

    model._dependencies = {};
    model._dependencies.brand = model.brand;

    delete model.dishes;
    delete model.brand;
    delete model.trainer.label;
    delete model.tags;
    return model;
  };

  MealService.prototype.calculateTotal = function() {
    var total = 0;
    this.model.dishes.forEach(function(dish){
      var sizePrice;
      var optionPrice;

      sizePrice = dish.size && dish.size.price ? dish.size.price : 0;
      optionPrice = Object.keys(dish.config).map(function(configId){
        var total = 0;
        var options = dish.config[configId].options;
        if (!angular.isArray(options)) {
          options = [options];
        }
        options.forEach(function(option){
          total += option.price || 0;
        }); 
        return total;
      })
      .reduce(function(prev, current){
        return prev + current;
      }, 0);

      total += optionPrice;

      if (sizePrice) {
        total += sizePrice;
      } else {
        total += dish.original.price;
      }
    });
    return total;
  };

  BaseFactory.extend(MealService, Meal);

  return MealService;
});