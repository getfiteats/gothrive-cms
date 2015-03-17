angular.module('cms')
.factory('BaseFactory', function BaseFactory($log, $q){
  var defaults = {};

  function Service(data, model) {
    var instanceDefaults;

    this.model = model;
    this.data = data || {};

    if (this.defaults) {
      setServiceProperties(angular.extend(this.defaults, this.data), this);
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

  Service.prototype._super = function() {
    var args = [].splice.call(arguments, 0, arguments.length);
    Service.apply(this, args);
  };
 
  Service.fromModel = function(data) {
    var service = Service.createInstance.call(this, data);
    return service;
  };
 
  Service.createInstance = function(data) {
    return new this.prototype.constructor(data, this.model);
  };

  Service.getService = function getService(data) {
    return this.createInstance(data);
  };

  Service.getServiceByQuery = function getServiceByQuery(query, include) {
    var deferred = $q.defer();
    var service;
    var self = this;

    if (include) {
      query.include = include;
    }

    this.model.findOne({filter: query}).$promise
      .then(function(data){
        service = Service.fromModel.call(self, data);
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
    return Service.getServiceByQuery.call(this, query, include);
  };

  Service.extend = function(child, model) {
    var statics = Object.keys(Service);
    var fn;

    statics.forEach(function(fnName){
      if (fnName === 'extend') {
        return;
      }
      fn = Service[fnName];
      child[fnName] = function() {
        var args = [].splice.call(arguments, 0, arguments.length);
        return fn.apply(child, args);
      };
    });
    angular.extend(child.prototype, Service.prototype);
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