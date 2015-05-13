angular.module('cms')
.factory('DishFactory', function DishFactory($log, $q, BaseFactory, Dish){

  function DishService(data) {
    this._super(data, Dish);
  }

  BaseFactory.extend(DishService, Dish);

  return DishService;
});
