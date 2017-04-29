'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:InscriptionCtrl
 * @description
 * # InscriptionCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('InscriptionCtrl', function ($rootScope, $scope, $localStorage, ngCart, User, Product, Team) {
    $scope.$storage = $localStorage;
    $scope.formData = {
      products: {
        burger: '0',
        dej: '0'
      }
    };

    User.get({ id: 'me' }, function(user) {
      $scope.formData.infosUser = user;
    });

    $scope.existingTeams = Team.query({event_id: 1});
    $scope.gameProducts = Product.query({type: 'inscriptions'});

    $rootScope.dataDebug.formData = $scope.formData;
    $rootScope.dataDebug.cart = ngCart.getCart();

    // $scope.gameProducts = [
    //   {id:1, name:'Animations', max:1, price: 20.00},
    //   {id:2, name:'Counter-Strike: Global Offensive', max:1, price: 20.00},
    //   {id:3, name:'League of Legends', max:1, price: 20.00},
    //   {id:4, name:'Overwatch', max:1, price: 20.00}
    // ];

    $scope.otherProducts = [
      {id:1, name:'Burger', max: 4, price: 13.00},
      {id:2, name:'Petit-dej', max: 2, price: 5.00}
    ];

    // $scope.existingTeams = [
    //   {id:1, name:'CouCouchClan'},
    //   {id:2, name:'Les zebis'},
    //   {id:3, name:'TrololoBoyz'},
    //   {id:4, name:'Boloss United'}
    // ];

    $scope.paypalInfos = {
      paypal: {
        business:'tresorier@festigeek.ch',
        item_number:'lan2017',
        currency_code:'CHF'
      }
    };

    // toaster si équipe inexistante
  });
