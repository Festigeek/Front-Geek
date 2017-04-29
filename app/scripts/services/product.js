'use strict';

/**
 * @ngdoc service
 * @name frontGeekApp.User
 * @description
 * # Country
 * Factory in the frontGeekApp.
 */
angular.module('frontGeekApp')
  .factory('Product', function (urls, $resource) {
    // Product service used to communicate with the product ressource of the API
    return $resource(urls.BASE_API + '/products/:id', { id: '@id' });
  });
