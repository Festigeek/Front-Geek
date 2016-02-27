'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('AccountCtrl', function (urls, $scope, $http) {
    
    $scope.test = [];

    $http({
      url: urls.BASE_API + '/users',
      method: 'GET'
    }).then(function(response) {
      $scope.test = response.data;
    }, function(error) {
      console.log(error.data);
    });

  });
