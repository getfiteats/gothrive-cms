angular.module( 'cms.home', [
  'ui.router'
])
.config(function config( $stateProvider ) {

  $stateProvider
    .state('main', {
      url: '/',
      views: {
        "main": {
          controller: 'HomeCtrl',
          templateUrl: 'home/home.tpl.html'
        }
      },
      data:{ pageTitle: 'Home' }
    });
})
.controller('HomeCtrl', function AdminController( $scope, $state, $log, $location, User, Brand ) {
  
  $log.info('HomeCtrl::', User.isAuthenticated());
  
  if (!User.isAuthenticated()) {
    $state.go('login.unauthenticated');
  } 

  $scope.$watch('selectedBrand', function(newBrand, oldBrand){
    if (!newBrand) {
      return;
    }

    $state.go('manageBrand', { brandId: newBrand.originalObject.id });
  });

});
