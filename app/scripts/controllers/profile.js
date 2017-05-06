'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('ProfileCtrl', function ($scope, $auth, $localStorage, toastr, User, Country) {

    $scope.$storage = $localStorage;

    $scope.$storage.countries = ($scope.$storage.countries !== undefined) ? $scope.$storage.countries : Country.query();
    $scope.countries = $scope.$storage.countries;
    $scope.user = {};

    $scope.subPage = 1;

    User.get({ id: 'me' }, function(user) {
      $scope.user = user;
    });

    $scope.updateUser = function() {
      User.update({ id: 'me' }, $scope.user).$promise
        .then(function() {
          $scope.$storage.checkedUser = true;
          toastr.success('Profil mis à jour avec succès !');
        });
    };
  });
