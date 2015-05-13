angular.module('cms')
.factory('BaseFactory', function BaseFactory($log, $q){

  function Service(model, modelClass) {
    this.modelClass = modelClass;
    this.model = model ? this.toViewSchema(model) : {};
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

  // Transform for DB
  Service.prototype.toStorageSchema = function() {
    return this.model;
  };

  // Transform for UI
  Service.prototype.toViewSchema = function(model) {
    return model;
  };

  Service.prototype.save = function save() {
    var model = this.toStorageSchema();
    return this.modelClass.create(model).$promise;
  };

  Service.prototype.update = function update() {
    var model = this.toStorageSchema();

    if (model && !model.id) {
      throw "Id must be present for update";
    }
    return new this.modelClass(model).$save();
    //TODO: Figure out why update saves objectid properties as string
    //return Service.updateById(model.id, model);
  };

  Service.prototype._super = Service;
 
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
    extendStaticProperties(child, Service);
    extendPrototype(child, Service);
  };

  function extendPrototype(child, Service) {
    Object.keys(Service.prototype).forEach(function(fnName){
      if (!child.prototype.hasOwnProperty(fnName)) {
        child.prototype[fnName] = Service.prototype[fnName];
      }
    });
  }

  function extendStaticProperties(child, Service) {
    var prop;
    var statics = Object.keys(Service);
    statics.forEach(function(propName){
      if (child.hasOwnProperty(propName)) {
        return;
      }
      prop = Service[propName];
      if (typeof prop !== "function") {
        child[propName] = prop;
      } else {
        child[propName] = prop.bind(child);
      }
    });
  }

  return Service;
});