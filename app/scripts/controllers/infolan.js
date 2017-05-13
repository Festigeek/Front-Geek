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
    $scope.teams = {
      lol: Team.query({event_id: 1, game: 1}),
      ow: Team.query({event_id: 1, game: 2}),
      cs: Team.query({event_id: 1, game: 3})
    };
  });
