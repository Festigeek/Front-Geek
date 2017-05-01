'use strict';

/**
 * @ngdoc service
 * @name frontGeekApp.fgCheckServer
 * @description
 * # fgCheckServer is used to check the back-end disponibility
 * Factory in the frontGeekApp.
 */
angular.module('frontGeekApp')
  .factory('checkServer',  ['urls', '$http', function (urls, $http) {
    return function() {
      return $http.get(urls.BASE_API);
    };
  }]);
