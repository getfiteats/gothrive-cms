angular.module('cms').directive('autoFocus', function ($timeout) {
    return {
        link: function($scope, $element, attrs) {
            if (attrs.autoFocus === true) {
                setFocus();
            } else {
                $scope.$watch(attrs.autoFocus, function(newValue){
                    if ( newValue ) {
                        setFocus();
                    }
                });                
            }

            function setFocus() {
                $timeout(function(){
                    $element[0].focus();
                });
            }
        }
     };
});