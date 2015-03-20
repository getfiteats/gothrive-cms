angular.module( 'cms', [
  'ui.router',
  'ui.bootstrap',
  'angucomplete',
  'angularjs-dropdown-multiselect',
  'ngNotificationsBar',
  'ngStorage',
  'ngTagsInput',
  'sticky',
  'templates-app',
  'templates-common',
  'cms.auth',
  'cms.helpers',
  'cms.breadcrumbs',
  'cms.cloudinary',
  'cms.login',
  'cms.home',
  'cms.meal',
  'cms.trainer',
  'cms.modals',
  'cms.gothriveServices'
])
.config(function myAppConfig( $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise( '/' );
})
.config(function(LoopBackResourceProvider, initData){
  LoopBackResourceProvider.setUrlBase(initData.apiUri);  
})
.config(function notificationsConfig(notificationsConfigProvider) {
  notificationsConfigProvider.setAutoHide(true);
  notificationsConfigProvider.setHideDelay(3000);
})
.config(function config( $stateProvider ) {
  $stateProvider
    .state('auth callback', {
      url: '/auth/callback?access_token&userId',
      views: {
        'main': {
          controller: 'AuthCallbackCtrl'
        }
      },
      data:{ pageTitle: 'Authorize' }
    });
})
.controller('AppCtrl', function AppCtrl ($scope, $rootScope, $log, User, breadcrumbs, initData, LoopBackAuth) {
  $rootScope.apiUri = initData.apiUri;
  $rootScope.apiBaseUri = initData.apiBaseUri;
  $rootScope.CLOUDINARY_BASE_URL = initData.cloudinaryBaseUrl;
  
  if (LoopBackAuth.accessTokenId) {
    $rootScope.accessTokenId = LoopBackAuth.accessTokenId;
  }
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if (angular.isDefined(toState.data.pageTitle)) {
      $scope.pageTitle = toState.data.pageTitle + ' | GoThrive - CMS' ;
    }
    if (angular.isDefined(toState.data.bodyClass)) {
      $scope.bodyClass = toState.data.bodyClass;
    }
    
    $scope.userAuthenticated = User.isAuthenticated();
    $scope.breadcrumbs = breadcrumbs.update();
    $log.info("$scope.userAuthenticated", $scope.userAuthenticated, $scope.breadcrumbs);
  });
});