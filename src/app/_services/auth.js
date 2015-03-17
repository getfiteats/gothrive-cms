angular.module('cms.auth')
.service('AuthService', function (LoopBackAuth){

  function AuthService() {
  }

  AuthService.prototype.login = function(accessToken, userId) {
    LoopBackAuth.setUser(accessToken, userId);
    LoopBackAuth.save();
  };

  return new AuthService();
});
