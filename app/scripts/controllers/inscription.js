'use strict';


/**
 * @ngdoc function
 * @name frontGeekApp.controller:InscriptionCtrl
 * @description
 * # InscriptionCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('InscriptionCtrl', function ($window, $rootScope, $scope, $localStorage, $state, $transitions, toastr, User, Country, Product, Team, Order, moment) {
    $scope.$storage = $localStorage;
    $scope.$storage.countries = ($scope.$storage.countries !== undefined) ? $scope.$storage.countries : Country.query();

    $scope.countries = $scope.$storage.countries;
    $scope.formData = {
      team: '',
      products: {
        tournament: {},
        burger: {
          id:5,
          price:13,
          amount:0
        },
        bfast:{
          id:6,
          price:5,
          amount:0
        }
      },
      consent: {
        cable: false,
        rules: false
      }
    };
    $scope.payload = undefined;

    // GET API

    $scope.infosUser = User.get({ id: 'me' }, function(user) {
      $scope.formData.user_id = user.id;
      if(moment().diff(moment(user.birthdate), 'years') < 18){
        $scope.underage = true;
      }
    });

    $scope.existingTeams = [{id:1, name:'RageQuit'}];//Team.query({event_id: 1});
    $scope.gameProducts = Product.query({type_id: 1}, function(){
      $scope.gameProducts.map(function(gameProduct){
        gameProduct.available = gameProduct.quantity_max - gameProduct.sold;
      });
    });

    // FUNCTIONS

    // Fonction s'assurant que le compte de l'utilisateur a été mis à jour
    var updateUser = function() {
      $scope.infosUser.$update(function () {
          toastr.info('Profil mis à jour.');
          return true;
        },
        function() {
          toastr.error('Erreur lors de la mise à jour du profil.');
          return false;
        });
    };

    $scope.viewBattleTag = function(){
      return $scope.formData.products.tournament.name === 'Overwatch';
    };

    $scope.viewLoL = function(){
      return $scope.formData.products.tournament.name === 'League Of Legend';
    };

    $scope.viewSteamID = function(){
      return $scope.formData.products.tournament.name === 'Counter-Strike: GO';
    };

    // Fonction s'assurant que le formulaire d'inscription est complet
    var inscriptionComplete = function() {
      return $scope.formData.consent.cable &&
        $scope.formData.consent.rules &&
        $scope.formData.products.tournament.id &&
        ($scope.formData.products.tournament.need_team === 0 || $scope.formData.team) &&
        (!$scope.underage || $scope.formData.consent.check_underage) &&
        (!$scope.viewBattleTag() || $scope.infosUser.battleTag) &&
        (!$scope.viewLoL() || $scope.infosUser.lol_account) &&
        (!$scope.viewSteamID() || $scope.infosUser.steamID64);
    };

    // Fonction mettant à jour le payload de l'inscription
    var updatePayload = function() {
      $scope.payload = {
        event_id: 1,
        checked_legal: $scope.formData.consent.rules,
        team: (typeof $scope.formData.team.originalObject === 'object') ? $scope.formData.team.originalObject.name : $scope.formData.team.originalObject,
        products: [
          {
            product_id: $scope.formData.products.tournament.id,
            amount: 1
          },
          {
            product_id: 5,
            amount: $scope.formData.products.burger.amount
          },
          {
            product_id: 6,
            amount: $scope.formData.products.bfast.amount
          }
        ],
        data: JSON.stringify($scope.formData)
      };

    };

    // Fonction permettant de soumettre la commande (inscription)
    $scope.postOrder = function(type) {
      $scope.payload.payment_type_id = type;

      var newOrder = new Order($scope.payload);
      newOrder.$save(function(res) {
        if(type === 1) {
          $state.go('checkout', {state: res.state});
        }

        if(type === 2) {
          $window.open(res.link, '_self');
        }
      }),
      function() {
        $state.go('checkout', {state: 'error'});
        toastr.error('Erreur lors de l\'envoi de l\'inscription.');
      };
    };

    // EVENTS

    // Conditions pour atteindre l'état .games depuis .infos
    $transitions.onBefore({to: 'inscriptions.games', from: 'inscriptions.infos'}, function(){
      if(!$scope.infosUser.is_consistent()) {
        toastr.warning('Merci de vérifier le contenu du formulaire', 'Données incomplètes');
        return false;
      }
    });

    // Lors de l'accès à l'état .games depuis .infos
    $transitions.onStart({to: 'inscriptions.games', from: 'inscriptions.infos'}, function() {
      return updateUser();
    });

    // Conditions pour atteindre l'état .payment
    $transitions.onBefore({to: 'inscriptions.payment'}, function(){
      if(!$scope.infosUser.is_consistent() || !inscriptionComplete()) {
        toastr.warning('Impossible d\'accéder à la page de paiement.', 'Données incomplètes');
        return false;
      }
    });

    // Lors de l'accès à l'état .payment
    $transitions.onStart({to: 'inscriptions.payment'}, function(){
      updatePayload();
      return updateUser();
    });
  });
