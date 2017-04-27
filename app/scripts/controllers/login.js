'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('LoginCtrl', function (urls, $rootScope, $scope, $http, $auth, $location, ngDialog, toastr, User, $localStorage) {
    $scope.$storage = $localStorage;
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
              $scope.$storage.loggedUser = {
                username: user.username
              };
              $rootScope.username = user.username;
            });
            toastr.success('Authentification réussie !');
            // $rootScope.dialog.close();
            ngDialog.closeAll();
          }
        })
        .catch(function(error) {
          console.log(error);
          toastr.error(error.data.error, error.statusText);
          ngDialog.closeAll();
          // $rootScope.dialog.close();
        });
    };
  });
