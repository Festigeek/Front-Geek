'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:InscriptionCtrl
 * @description
 * # InscriptionCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('InscriptionCtrl', function ($rootScope, $scope) {
    $scope.formData = {};
    $rootScope.dataDebug.formData = $scope.formData;

    $scope.gameProducts = [
      {id:1, name:'Animations'},
      {id:2, name:'Counter-Strike: Global Offensive'},
      {id:3, name:'League of Legends'},
      {id:4, name:'Overwatch'}
    ];

    $scope.otherProducts = [
      {id:1, name:'Burger', max: 4},
      {id:2, name:'Petit-dej', max: 2}
    ];

    $scope.existingTeams = [
      {id:1, name:'CouCouchClan'},
      {id:2, name:'Les zebis'},
      {id:3, name:'TrololoBoyz'},
      {id:4, name:'Boloss United'}
    ];
  });
