'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('RegisterCtrl', function ($scope) {

    $scope.isDatepickerOpen = false;

    $scope.openDatepicker = function() {
      $scope.isDatepickerOpen = true;
    };
    
  });
