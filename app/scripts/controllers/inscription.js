'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:InscriptionCtrl
 * @description
 * # InscriptionCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('InscriptionCtrl', function ($window, $q, $rootScope, $scope, $localStorage, $state, $transitions, toastr, ngDialog, User, Country, Product, Team, Order, moment) {
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

    $scope.existingTeams = Team.query({event_id: 2});
    $scope.gameProducts = Product.getProductsByEvent({type_id: 1, event_id: 2}, function(){
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

    //fonction vérifiant le code d'équipe avant l'envoi du formulaire
    $scope.testTeamCode = function(){
      //TODO problem with callback, not going into the exception
      $scope.teamCodeResult = Team.testCode({event_id: 2, team_code: $scope.formData.team_code}, function(name){
        //callback
        console.log(team)
        $scope.teamCodeResult.name = name;
          console.log('outside if', $scope.teamCodeResult);
        if($scope.teamCodeResult.data.error !== undefined){
          $scope.teamCodeResult.name = 'Aucune équipe n\'a été trouvée avec ce code';
          console.log('dans le if erreur', $scope.teamCodeResult);
        }
      });//resource, modèle
      console.log($scope.teamCodeResult);
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
      return $q(function(resolve) {
        var productsList = [{ product_id: $scope.formData.products.tournament.id, amount: 1 }];
        if($scope.formData.products.burger.amount > 0) {
          productsList.push({product_id: 5, amount: $scope.formData.products.burger.amount});
        }
        if($scope.formData.products.bfast.amount > 0) {
          productsList.push({ product_id: 6, amount: $scope.formData.products.bfast.amount });
        }

        $scope.payload = {
          event_id: 2,
          checked_legal: $scope.formData.consent.rules,
          team: (typeof $scope.formData.team.originalObject === 'object') ? $scope.formData.team.originalObject.name : $scope.formData.team.originalObject,

          products: productsList,
          data: JSON.stringify($scope.formData)
        };
        resolve();
      });
    };

    // Fonction permettant de soumettre la commande (inscription)
    $scope.postOrder = function(type) {
      ngDialog.openConfirm({
        template: '<h3>L\'inscription est sur le point d\'être envoyée.</h3><p>Es-tu sûr que tout est bon ?</p><div class="ngdialog-buttons text-center"><button type="button" class="btn btn-success" ng-click="confirm(1)">Oui, c\'est parti !</button><button type="button" class="btn btn-danger" ng-click="closeThisDialog(0)">Non, attends !</button></div>',
        plain: true
      }).then(function(){
        $scope.payload.payment_type_id = type;

        var newOrder = new Order($scope.payload);
        newOrder.$save(function(res) {
          if(type === 1) {
            $state.go('checkout', {state: res.state});
          }

          if(type === 2) {
            $window.open(res.link, '_self');
          }
        }, function() {
          $state.go('checkout', {state: 'error'});
          toastr.error('Erreur lors de l\'envoi de l\'inscription.');
        });
      });
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
      return updatePayload().then(function(){
        return updateUser();
      });
    });
  });
