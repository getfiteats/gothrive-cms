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
      dish.selectedOptions = {};
      dish.optionGroups.forEach(function(optionGroup){
        dish.selectedOptions[optionGroup.id] = [];
        optionGroup.options.forEach(function(option){
          option.label = option.name + ' +$' + option.price;
        });
      });
      return { id: dish.src.externalId, label: dish.name, original: dish };
    });
  };


  BaseFactory.extend(DeliveryService, Delivery);

  return DeliveryService;
});
