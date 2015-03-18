angular.module('cms')
.factory('GooglePlacesFactory', function GooglePlacesFactory($log, $q, BaseFactory, GooglePlace){

  function GooglePlacesService(data) {
    this._super(data, GooglePlace);
  }

  GooglePlacesService.formatAddress = function(addresComponents) {
    var address = {};

    try {
      address.address = addresComponents[0].long_name + ' ' + addresComponents[1].long_name;
      address.city = addresComponents[2].long_name;
      address.state = addresComponents[3].long_name;
      address.country = addresComponents[4].long_name;
      address.zip = addresComponents[5].long_name;
    } catch(err) {
      address = null;
    } 
  
    return address;
  };

  BaseFactory.extend(GooglePlacesService, GooglePlace);

  return GooglePlacesService;
});