'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:InscriptionCtrl
 * @description
 * # InscriptionCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('InscriptionCtrl', function ($rootScope, $scope, ngCart) {
    $scope.formData = {};
    $rootScope.dataDebug.formData = $scope.formData;

    $scope.gameProducts = [
      {id:1, name:'Animations', max:1, price: 20.00},
      {id:2, name:'Counter-Strike: Global Offensive', max:1, price: 20.00},
      {id:3, name:'League of Legends', max:1, price: 20.00},
      {id:4, name:'Overwatch', max:1, price: 20.00}
    ];

    $scope.otherProducts = [
      {id:1, name:'Burger', max: 4, price: 13.00},
      {id:2, name:'Petit-dej', max: 2, price: 5.00}
    ];

    $scope.existingTeams = [
      {id:1, name:'CouCouchClan'},
      {id:2, name:'Les zebis'},
      {id:3, name:'TrololoBoyz'},
      {id:4, name:'Boloss United'}
    ];
  });
