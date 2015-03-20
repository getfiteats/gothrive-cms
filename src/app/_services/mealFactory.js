angular.module('cms')
.factory('MealFactory', function MealFactory($log, $q, BaseFactory, Meal){

  function MealService(data) {
    this.defaults = {
      trainer: {},
      dishes: [],
      brand: {},
      summary: ''
    };
    this._super(data, Meal);
  }

  MealService.prototype.toStorageSchema = function() {
    var model = angular.copy(this.model);

    model.dishReferences = this.model.dishes.map(function(dish){
      var dishReference = {};
      if (dish.size) {
        dishReference.size = {
          externalId: dish.size.id,
          name: dish.size.name,
          price: dish.size.price
        };
      }
      dishReference.externalId = dish.id;
      dishReference.instructions = dish.instructions;
      dishReference.config = Object.keys(dish.config).map(function(configId){
        var configData = angular.copy(dish.config[configId]);
        var config = {};

        if (!angular.isArray(configData.options)) {
          configData.options = [configData.options];
        }

        config.name = configData.name;
        config.externalId = configId;
        config.options = configData.options.map(function(option){
          return { externalId: option.id, price: option.price, name: option.name };
        });
        return config;
      });
      return dishReference;
    });

    model.ingredients = this.model.ingredients.map(function(ingredient){
      return ingredient.text;
    });

    model._dependencies = {};
    model._dependencies.brand = model.brand.original;
    model._dependencies.dishes = model.dishes.map(function(dish){
      return dish.original;
    });
    model._dependencies.nutritionTags = model.tags.map(function(tag){
      return { name: tag.text };
    });

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

      if (sizePrice) {
        total += optionPrice + sizePrice;
      } else {
        total += dish.original.price;
      }
    });
    return total;
  };

  BaseFactory.extend(MealService, Meal);

  return MealService;
});