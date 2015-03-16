angular.module('cms.breadcrumbs', [])
  .service('breadcrumbs', function($location){

    function uppercase(str) {
      return str.charAt(0).toUpperCase() + str.substr(1,str.length);
    }

    var BreadCrumbs = function(){
      this.breadcrumbs = [];
      window.$location = $location;
    };

    BreadCrumbs.prototype.update = function update() {
      var self = this;
      var paths = $location.url().replace(/\/$/, '').split('/');
      var pathList = "";

      this.breadcrumbs = [];

      angular.forEach(paths, function(path, i){
        var pathText = "";
        
        if (i === 0) {
          self.breadcrumbs.push({
            href: '#/',
            text: 'GoThrive'
          });
          return;
        }

        if (path) {
          path = path.split('?')[0];
          pathText = path.split('-').map(function(pathPart){
            return pathPart.charAt(0).toUpperCase() + pathPart.substr(1,pathPart.length);
          }).join(' ');
          pathList += '/' + path;
        }
        
        path = uppercase(path);
        self.breadcrumbs.push({
          href: '#' + pathList,
          text: pathText
        });
      });

      return this.breadcrumbs;
    };

    return new BreadCrumbs();
  });