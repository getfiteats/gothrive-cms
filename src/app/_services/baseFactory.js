angular.module('cms')
.factory('BaseFactory', function BaseFactory($log, $q){

  function Service(model, modelClass) {
    this.modelClass = modelClass;
    this.model = model || {};

    if (this.defaults) {
      this.model = angular.extend(this.defaults, this.model);
    }
  }

  Service.prototype.get = function(key) {
    return this.model[key];
  };

  Service.prototype.set = function(key, value) {
    this.model[key] = value;
  };

  Service.prototype.save = function save() {
    return this.modelClass.create(this.model).$promise;
  };

  Service.prototype.update = function update() {
    if (this.model && !this.model.id) {
      throw "Id must be present for update";
    }
    return new this.modelClass(this.model).$save();
    //TODO: Figure out why update saves objectid properties as string
    //return Service.updateById(model.id, model);
  };

  Service.prototype._super = function() {
    var args = [].splice.call(arguments, 0, arguments.length);
    Service.apply(this, args);
  };
 
  Service.fromModel = function(model) {
    var service =  Service.createInstance.call(this, model);
    return service;
  };
 
  Service.createInstance = function(model) {
    return new this.prototype.constructor(model, this.modelClass);
  };

  Service.getService = function getService(model) {
    return this.createInstance(model);
  };

  Service.getServiceByQuery = function getServiceByQuery(query, include) {
    var deferred = $q.defer();
    var service;
    var self = this;

    if (include) {
      query.include = include;
    }

    this.modelClass.findOne({filter: query}).$promise
      .then(function(model){
        service = Service.fromModel.call(self, model);
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

  Service.extend = function(child, modelClass) {
    child.modelClass = modelClass;
    extendStaticMethods(child, Service);  
    angular.extend(child.prototype, Service.prototype);
  };

  function extendStaticMethods(child, Service) {
    var fn;
    var statics = Object.keys(Service);
    statics.forEach(function(fnName){
      fn = Service[fnName];
      if (typeof fn !== "function") {
        return;
      }
      child[fnName] = fn.bind(child);
    });
  }

  return Service;
});