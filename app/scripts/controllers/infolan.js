'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:InfolanCtrl
 * @description
 * # InfolanCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('InfolanCtrl', function ($scope, Team) {
    $scope.teams = Team.query({event_id: 2});
  });
