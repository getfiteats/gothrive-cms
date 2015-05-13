angular.module('cms')
.factory('DeliveryFactory', function DeliveryFactory($log, $q, BaseFactory, Delivery){

  function DeliveryService(data) {
    this._super(data, Delivery);
  }

  DeliveryService.formatRestaurants = function(restaurants) {
    return restaurants.map(function(restaurant){
      return { id: restaurant.src.externalId, label: restaurant.name, original: restaurant };
    });
  };

  DeliveryService.formatDishes = function(dishes) {
    return dishes.map(function(dish){
      var selectedOptions = {};
      var selectedSize =  _.findWhere(dish.sizes, { selected: true }) || {};
      
      dish.options.forEach(function(option){
        var choices = option.maxSelection === 1 ? {} : [];

        if (option.selected) {
          choices = option.maxSelection === 1 ? options.choices[0] : _.where(option.choices, { selected: true });
        }
      
        selectedOptions[option.id] = {name: option.name, choices: choices};
        option.choices.forEach(function(choice){
          choice.label = choice.name + ' +$' + choice.price;
        });
      });

      dish.sizes.forEach(function(size){
        size.label = size.name + ' +$' + size.price;
      });

      return { 
        id: dish.src.externalId, 
        label: dish.section + ' - ' + dish.name, 
        selectedOptions: selectedOptions, 
        original: dish,
        section: dish.section, 
        selectedSize: selectedSize 
      };
    });
  };


  BaseFactory.extend(DeliveryService, Delivery);

  return DeliveryService;
});
