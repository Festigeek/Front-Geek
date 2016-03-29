'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('RegisterCtrl', function (urls, $scope, $http, aiStorage, $location) {
    // Control datepicker
    $scope.isDatepickerOpen = false;

    $scope.openDatepicker = function() {
      $scope.isDatepickerOpen = true;
    };

    // 3. Errors / Succes handling

    // Register
    $scope.signup = function() {
      $http({
        url: urls.BASE_API + '/users',
        method: 'POST',
        data: $scope.register.user
      }).then(function(response) {
        aiStorage.set('token', response.data.token);
        $location.path('/');
      }, function(error) {
        console.log(error.data);
      });
    };
    
  });
