'use strict';

/**
 * @ngdoc service
 * @name frontGeekApp.User
 * @description
 * # Country
 * Factory in the frontGeekApp.
 */
angular.module('frontGeekApp')
  .factory('Country', function (urls, $resource) {
    // User service used to communicate with the user ressource of the API
    return $resource(urls.BASE_API + '/countries/:id', { id: '@id' });
  });
