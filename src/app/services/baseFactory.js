angular.module('cms')
.factory('BaseFactory', function DishFactory($log, $q){
  var defaults = {};

  function Service(model, data) {
    var instanceDefaults;

    data = data || {};
    this.model = model;
    this.data = this.data || {};

    if (this.defaults) {
      instanceDefaults = angular.copy(this.defaults);
      setServiceProperties(angular.extend(instanceDefaults, data), this);
    }
  }

  Service.prototype.get = function(key) {
    return this.data[key];
  };

  Service.prototype.set = function(key, value) {
    this.data[key] = value;
  };

  Service.prototype.toModel = function toModel() {
    var data = getServiceProperties(this);
    return data;
  };

  Service.fromModel = function(data) {
    var service = new this.model();
    setServiceProperties(data, service);
    return service;
  };

  Service.prototype.save = function save() {
    var data = this.toModel();
    return this.model.create(data).$promise;
  };

  Service.prototype.update = function update() {
    var data = this.toModel();
    if (data && !data.id) {
      throw "Id must be present for update";
    }
    return new this.model(data).$save();

    //TODO: Figure out why update saves objectid properties as string
    //return Service.updateById(data.id, data);
  };

  Service.getService = function getService(data) {
    return this.createInstance(data);
  };

  Service.getServiceByQuery = function getServiceByQuery(query, include) {
    var deferred = $q.defer();
    var service;

    if (include) {
      query.include = include;
    }

    this.model.findOne({filter: query}).$promise
      .then(function(data){
        service = Service.fromModel(data);
        deferred.resolve(service);
      })
      .catch(function(err){
        deferred.reject(err);
      });

    return deferred.promise;
  };

  Service.getServiceById = function getById(modelId, include) {
    var query = {
      where: {
        id: modelId
      }
    };
    return Service.getServiceByQuery(query, include);
  };

  Service.prototype.createInstance = function(data) {
    return new this.prototype.constructor(this.model, data);
  };

  function setServiceProperties(model, service) {
    for (var key in model) {
        service.data[key] = model[key];
    }
  }

  function getServiceProperties(service) {
    var model = {};
    for (var key in service.data) {
        model[key] = service.data[key];
    }

    return model;
  }

  return Service;
});