angular.module('cms')
.factory('TrainerFactory', function TrainerFactory($log, $q, BaseFactory, Trainer){

  function TrainerService(data) {
    this._super(data, Trainer);
  }

  BaseFactory.extend(TrainerService, Trainer);

  return TrainerService;
});