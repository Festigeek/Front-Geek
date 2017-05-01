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
        if(response.status >= 500) {
          var toastr = $injector.get('toastr');
          toastr.error('Erreur de communication avec le serveur.');
          console.log('Erreur ' + response.status + ':', response);
        }

        return $q.reject(response);
      }
    };

  });
