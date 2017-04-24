'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('ProfileCtrl', function ($scope, $auth, User) {
    $scope.user = {};
    $scope.subPage = 1;

    User.get({ id: $auth.getPayload().sub }, function(res) {
      $scope.user = res.user;
    });

  });
