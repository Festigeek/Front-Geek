'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('ProfileCtrl', function (urls, $scope, $auth, $location, $localStorage, toastr, User, Country, Order) {
    $scope.subPage = 1;

    $scope.$storage = $localStorage;
    $scope.$storage.countries = ($scope.$storage.countries !== undefined) ? $scope.$storage.countries : Country.query();
    $scope.countries = $scope.$storage.countries;
    $scope.user = {};

    User.get({ id: 'me' }, function(user) {
      $scope.user = user;
      Order.getFromUser({ user_id: user.id }, function(orders) {
        $scope.orders = orders;
      });
    });

    $scope.getTicket = function() {
      window.location.href = urls.BASE_API + '/orders/' + $scope.orders[0].id + '?format=pdf&token=' + $auth.getToken();
    };

    $scope.updateUser = function() {
      User.update($scope.user).$promise
        .then(function() {
          $scope.$storage.checkedUser = true;
          toastr.success('Profil mis à jour avec succès !');
        });
    };
  });
