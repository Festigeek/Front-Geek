'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('ProfileCtrl', function ($scope, $auth, toastr, User) {
    $scope.user = {};
    $scope.subPage = 1;

    User.get({ id: 'me' }, function(user) {
      $scope.user = user;
    });

    $scope.updateUser = function() {
      User.update({ id: 'me' }, $scope.user).$promise
        .then(function() {
          toastr.success('Profil mis à jour avec succès !');
        });
    };
  });
