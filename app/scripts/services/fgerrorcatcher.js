'use strict';

/**
 * @ngdoc service
 * @name frontGeekApp.fgErrorCatcher
 * @description
 * # fgErrorCatcher
 * Factory in the frontGeekApp.
 */
angular.module('frontGeekApp')
  .factory('fgErrorCatcher', function ($q, $injector) {

    return {
      responseError: function (response) {

        // Receive Unauthorized
        if(response.status >= 400) {
          var ngDialog = $injector.get('ngDialog');
          ngDialog.openConfirm({
            template: 'views/templates/fgErrorCatcher.html',
            className: 'ngdialog-theme-default ngdialog-theme-httpError',
            data: response
          });
        }

        return $q.reject(response);
      }
    };

  });
