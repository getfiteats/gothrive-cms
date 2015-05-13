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

    model._dishes = this.model.dishes.map(function(dish){
      var _dish = angular.copy(dish.original);

      _dish.sizes.forEach(function(size){
        if (dish.selectedSize.id === size.id) {
          size.selected = true;
        }
      });

      _dish.options.forEach(function(option){
        var selectedOption = dish.selectedOptions[option.id];
        var selectedChoices;

        if (!selectedOption) {
          return;
        }

        option.selected = true;
        option.choices.forEach(function(choice){
          choice.selected = _.some(selectedOption.choices, {id: choice.id});
        });
      });

      _dish.instructions = dish.original.instructions;
      return _dish;
    });
    model.ingredients = this.model.ingredients.map(function(ingredient){
      return ingredient.text;
    });
    model._nutritionTagReferences = Object.keys(model.tags).map(function(tagId){
      var tag = model.tags[tagId];
      return { nutritionTagId: tagId };
    });
    model._trainerReference = {trainerId: model.trainer.id, quote: model.trainer.quote};
    model._dependencies = {};
    model._dependencies.brand = model.brand.original;

    delete model.dishes;
    delete model.brand;
    delete model.trainer;
    delete model.tags;
    delete model.section;
    delete model.selectedOptions;
    delete model.selectedSize;
    return model;
  };

  MealService.prototype.toViewSchema = function(_model) {
    var model = {};

    if (_model.trainerReference && _model.trainerReference.trainer) {
      model.trainer = {
        label: _model.trainerReference.trainer.first + ' ' + _model.trainerReference.trainer.last,
        id: _model.trainerReference.trainer.id,
        quote: _model._trainerReference.quote
      };
    }

    if (_model._nutritionTagReferences) {
      model.tags = {};
      _.pluck(_model._nutritionTagReferences, 'nutritionTagId').forEach(function(tagId){
        model.tags[tagId] = true;
      });
    }

    if (_model._dishes) {
      model.dishes = DeliveryFactory.formatDishes(_model._dishes);
    }

    if (_model.brand) {
      model.brand = {
        id: _model.brand.id,
        label: _model.brand.name,
        original: _model.brand
      };
    }

    ['id', 'brandId', 'name', 'image', 'ingredients', 'summary', 'price', 'active'].forEach(function(key){
      model[key] = _model[key];
    });

    return model;
  };

  MealService.prototype.calculateTotal = function() {

    var total = 0;
    this.model.dishes.forEach(function(dish){
      var sizePrice;
      var optionPrice;

      sizePrice = dish.selectedSize && dish.selectedSize.price ? dish.selectedSize.price : 0;
      optionPrice = Object.keys(dish.selectedOptions).map(function(optionId){
        var total = 0;
        var choices = dish.selectedOptions[optionId].choices;
        if (!angular.isArray(choices)) {
          choices = [choices];
        }
        choices.forEach(function(choice){
          total += choice.price || 0;
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
