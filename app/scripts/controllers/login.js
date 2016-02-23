'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('LoginCtrl', function ($scope) {
    
    $scope.signin = function () {
      var formData = {
        email: $scope.email,
        password: $scope.password
      };

      Auth.signin(formData, successAuth, function () {
        $rootScope.error = 'Invalid credentials.';
      })
   };

  });
