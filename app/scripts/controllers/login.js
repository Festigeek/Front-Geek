'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('LoginCtrl', function (urls, $rootScope, $scope, $http, $auth, $location, ngDialog, toastr, User) {
    var drupalDialog;

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          if(response.data.success === 'drupal_account') {
            drupalDialog = ngDialog.open({
              template: 'templateNewForm',
              scope: $scope
            });
          }
          else {
            User.get({ id: 'me' }, function(user) {
              $rootScope.username = user.username;
              toastr.success('Authentification réussie !');
              ngDialog.closeAll();
            }, function() {
              toastr.error('Échec de l\'authentification.');
            });
          }
        })
        .catch(function() {
          toastr.error('Échec de l\'authentification.');
        });
    };
  });
