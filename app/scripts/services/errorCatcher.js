'use strict';

/**
 * @ngdoc service
 * @name frontGeekApp.fgErrorCatcher
 * @description
 * # fgErrorCatcher
 * Factory in the frontGeekApp.
 */
angular.module('frontGeekApp')
  .factory('errorCatcher', function ($q, $injector) {

    return {
      responseError: function (response) {

        // Receive Unauthorized
        if(response.status >= 400) {
          var ngDialog = $injector.get('ngDialog');
          ngDialog.openConfirm({
            template: 'views/templates/errorCatcher.html',
            className: 'ngdialog-theme-default ngdialog-theme-httpError',
            data: response
          });
        }

        return $q.reject(response);
      }
    };

  });
