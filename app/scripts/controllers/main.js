'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('MainCtrl', function ($rootScope, $location, aiStorage) {
    // Function to check if a token is stored
    $rootScope.haveToken = function() {
      return aiStorage.get('token') !== null;
    };

    // Function to active button on navBar
    $rootScope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };

    // Function to logout
    $rootScope.logout = function () { 
        aiStorage.remove('token');
        $location.path('/');
    };
  });
