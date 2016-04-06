'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('LoginCtrl', function ($scope, urls, $http, aiStorage, $location, ngDialog) {
    var drupalDialog;
    $scope.user = {};

    $scope.signin = function() {
      $http({
        url: urls.BASE_API + '/users/login',
        method: 'POST',
        data: $scope.user
      }).then(function(response) {
        if(response.data.drupal_account === true) {
          drupalDialog = ngDialog.open({ 
            template: 'templateNewForm',
            scope: $scope
          });
        }
        else {
          ngDialog.closeAll();
          aiStorage.set('token', response.data.token);
          $location.path('/');
        }
      }, function(error) {
        console.log(error.data);
      });
    };
  });
