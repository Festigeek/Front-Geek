'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:CheckoutCtrl
 * @description
 * # CheckoutCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('CheckoutCtrl', function ($scope, $stateParams, $state) {
    if($stateParams.state !== undefined) {
      $scope.resultState = $stateParams.state;
    }
    else {
      $state.go('main');
    }
  });
