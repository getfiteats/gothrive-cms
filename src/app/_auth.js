angular.module('cms.auth', [])  
.controller('AuthCallbackCtrl', function ($scope, $rootScope, $state, $location, $log, AuthService, $timeout) {
  var params = $location.search();
  var state = "main";

  if (!params.access_token || !params.userId) {
    state = "login.failure";
  } else {
    AuthService.login(params.access_token, params.userId);
    $rootScope.accessTokenId = params.access_token;
    $log.info("success", "going to state");
  }

  $timeout(function(){
    $state.go(state);
  });
})
.controller('MTurkAuthCallbackCtrl', function MTurkAuthCallbackController($scope, $rootScope, $state, $log, AuthService, $timeout){
  var state = "external createMenu";
  var options = {};
  var params = $location.search().payload.split(',');
  
  AuthService.login(params[0], params[1]);
  options.brandId = params[2];

  $timeout(function(){
    $state.go(state, options);
  });
});