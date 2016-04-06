'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('AccountCtrl', function ($scope, $http, urls, aiStorage, jwtHelper, User) {

    $scope.subPage = 1;

    User.get({ id: jwtHelper.decodeToken(aiStorage.get('token')).sub }, function(res) {
      $scope.user = res.user;
    });

    $http.get(urls.BASE_API + '/users/qrcode').then(function(res){
      $scope.user.qrCode = res.data;
    });

  });
