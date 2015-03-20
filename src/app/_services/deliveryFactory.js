angular.module('cms')
.factory('DeliveryFactory', function DeliveryFactory($log, $q, BaseFactory, Delivery){

  function DeliveryService(data) {
    this._super(data, Delivery);
  }

  DeliveryService.formatRestaurants = function(restaurants) {
    return restaurants.map(function(restaurant){
      var src = restaurant.src.filter(function(src){
        return src.name === "delivery";
      })[0];

      return { id: src.externalId, label: restaurant.name, original: restaurant };
    });
  };

  DeliveryService.formatDishes = function(dishes) {
    return dishes.map(function(dish){
      var config = {};
      var size = {};

      dish.optionGroups.forEach(function(optionGroup){
        var options = [];
        if (optionGroup.maxSelection === 1) {
          options = {};
        }
        config[optionGroup.id] = {name: optionGroup.name, options: options};
        optionGroup.options.forEach(function(option){
          option.label = option.name + ' +$' + option.price;
        });
      });

      dish.priceOptions.forEach(function(priceOption){
        priceOption.label = priceOption.name + ' +$' + priceOption.price;
      });

      return { id: dish.src.externalId, label: dish.name, config: config, size: size, original: dish };
    });
  };


  BaseFactory.extend(DeliveryService, Delivery);

  return DeliveryService;
});
