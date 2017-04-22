'use strict';

/**
 * @ngdoc service
 * @name frontGeekApp.User
 * @description
 * # User
 * Factory in the frontGeekApp.
 */
angular.module('frontGeekApp')
  .factory('User', function (urls, $resource) {
    // User service used to communicate with the user ressource of the API
    return $resource(urls.BASE_API + '/users/:id', { id: '@id' }, {
      login: { method: 'POST' }
    });
  });
