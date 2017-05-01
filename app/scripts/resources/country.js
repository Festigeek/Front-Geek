'use strict';

/**
 * @ngdoc service
 * @name frontGeekApp.Country
 * @description
 * # Country
 * Factory in the frontGeekApp.
 */
angular.module('frontGeekApp')
  .factory('Country', function (urls, $resource) {
    // User service used to communicate with the country ressource of the API
    return $resource(urls.BASE_API + '/countries/:id', { id: '@id' });
  });
