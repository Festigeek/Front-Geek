'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('LoginCtrl', function ($scope, urls, $http, $auth, $location, ngDialog, toastr) {
    $scope.user = {};
    var drupalDialog;

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          if(response.data.drupal_account === true) {
            drupalDialog = ngDialog.open({
              template: 'templateNewForm',
              scope: $scope
            });
          }
          else {
            toastr.success('Authentification réussie !');
            ngDialog.closeAll();
            //$location.path('/');
          }
        })
        .catch(function(error) {
          toastr.error(error.data.error, error.statusText);
          ngDialog.closeAll();
        });
    };
  });
