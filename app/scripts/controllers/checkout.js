'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:CheckoutCtrl
 * @description
 * # CheckoutCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('CheckoutCtrl', function ($scope, $stateParams) {
    $scope.resultState = $stateParams.state;
  });
