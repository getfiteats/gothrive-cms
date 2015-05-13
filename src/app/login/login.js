angular.module( 'cms.login', [
  'ui.router'
])
.config(function config( $stateProvider) {

  $stateProvider
    .state('login', {
      abstract: true,
      url: '/login',
      views: {
        "main": {
          controller: 'LoginCtrl',
          templateUrl: 'login/views/login.tpl.html'
        }
      },
      data:{ pageTitle: 'Login' }
    })
    .state('login.unauthenticated', {
      url: '',
      templateUrl: 'login/views/login.unauthenticated.tpl.html',
      controller: 'LoginCtrl', 
      data:{ 
        pageTitle: 'Login'
      }
    })
    .state('login.success', {
      url: '/success',
      templateUrl: 'login/views/login.success.tpl.html',
      controller: 'LoginCtrl',
      data:{ pageTitle: 'Login Success' }
    })
    .state('login.failure', {
      url: '/failure',
      templateUrl: 'login/views/login.failure.tpl.html',
      controller: 'LoginCtrl',
      data:{ pageTitle: 'Login Failed' }
    });

  $stateProvider
    .state('logout', {
      url: '/logout',
      views: {
        "main": {
          controller: 'LogoutCtrl'
        }
      },
      data:{ pageTitle: 'Logged Out' }
    });

})
.controller('LoginCtrl', function LoginController( $scope, $state ) {
  if ($state.is('login')) {
    console.log("login!");
  } else if ($state.is('login.success')) {
    console.log('login success!');
  } else if ($state.is('auth.failure')) {
    console.log('auth failure');
  }
})
.controller('LogoutCtrl', function LogoutController($scope, $rootScope, $state, $timeout, User){
  User.logout()
    .$promise.then(function(){
      console.log('inpromise::logged out!');
      $rootScope.accessTokenId = null;
      $state.go('main');
    }).catch(function(){
      console.log('error logging out');
    });
});