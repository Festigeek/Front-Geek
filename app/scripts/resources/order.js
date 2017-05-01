'use strict';

/**
 * @ngdoc service
 * @name frontGeekApp.Order
 * @description
 * # Order
 * Factory in the frontGeekApp.
 */
angular.module('frontGeekApp')
  .factory('Order', function (urls, $resource) {
    // User service used to communicate with the order ressource of the API
    return $resource(urls.BASE_API + '/orders/:id', { id: '@id' });
  });
