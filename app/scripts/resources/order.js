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
    var Order = $resource(urls.BASE_API + '/orders/:id', { id: '@id' }, {
      'getFromUser': {
        url: urls.BASE_API + '/users/:user_id/orders',
        method: 'GET',
        params: { user_id: '@user_id' },
        isArray: true
      }
    });

    return Order;
  });
