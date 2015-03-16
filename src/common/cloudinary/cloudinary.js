$.cloudinary.config().cloud_name = 'getfiteats';
$.cloudinary.config().upload_preset = 'ccwppvif';

angular.module('cms.cloudinary', ['angularFileUpload'])

  .directive('cloudinary', function factory ($upload) {
    // disableImageResize: false,
    // imageMaxWidth: 800,
    // imageMaxHeight: 600,
    // acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|ico)$/i,
    // maxFileSize: 20000000, // 20MB
    return {
      restrict: 'AE',
      require: 'ngModel',
      templateUrl: 'cloudinary/cloudinary.tpl.html',
      scope: {
        'ngModel': '='
      },
      link: function($scope, $element, $attrs, ngModel) {
        $scope.$watch('files', function() {
          if (!$scope.files) {
            return;
          }
          $scope.files.forEach(function(file){
            $scope.upload = $upload.upload({
              url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
              fields: {
                upload_preset: $.cloudinary.config().upload_preset,
                tags: 'gothrive',
                disableImageResize: false,
                imageMaxWidth: 800,
                imageMaxHeight: 600,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|ico)$/i,
                maxFileSize: 20000000 // 20MB
              },
              file: file
            }).progress(function (e) {
              file.progress = Math.round((e.loaded * 100.0) / e.total);
              file.status = "uploading";
            }).success(function (data, status, headers, config) {
              ngModel.$setViewValue(data);
              file.result = data;
              file.status = "complete";
            }).error(function(response){
                $scope.uploadError = response.error.message;
            });
          });
        });

        /* Modify the look and fill of the dropzone when files are being dragged over it */
        $scope.dragOverClass = function($event) {
          var items = $event.dataTransfer.items;
          var hasFile = false;
          if (items != null) {
            for (var i = 0 ; i < items.length; i++) {
              if (items[i].kind == 'file') {
                hasFile = true;
                break;
              }
            }
          } else {
            hasFile = true;
          }
          return hasFile ? "dragover" : "dragover-err";
        };

      }
    };
  });
