'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('LoginCtrl', function ($scope, urls, $http, $auth, $location, ngDialog, toastr, User, $rootScope) {
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
            User.get({ id: $auth.getPayload().sub }, function(res) {
              $rootScope.loggedUser = res.user;
            });
            toastr.success('Authentification réussie !');
            $rootScope.dialog.close();
            ngDialog.closeAll();
            //$location.path('/');
          }
        })
        .catch(function(error) {
          console.log(error);
          toastr.error(error.data.error, error.statusText);
          ngDialog.closeAll();
          $rootScope.dialog.close();
        });
    };
  });
