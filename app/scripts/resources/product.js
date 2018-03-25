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

    var Product = $resource(urls.BASE_API + '/products/:id', { id: '@id' }, {
      'getProductsByEvent' : {
        url: urls.BASE_API + '/events/:event_id/products',
        method: 'GET',
        params: { event_id: '@event_id' },
        isArray: true
      }
    })
    // Product service used to communicate with the product ressource of the API
    return Product;
  });
