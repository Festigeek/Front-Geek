'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('LogoutCtrl', function($location, $auth, toastr) {
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
        toastr.info('Vous vous être déconnecté avec succès');
        $location.path('/');
      });
  });
