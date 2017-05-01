'use strict';


/**
 * @ngdoc function
 * @name frontGeekApp.controller:InscriptionCtrl
 * @description
 * # InscriptionCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('InscriptionCtrl', function ($rootScope, $scope, $localStorage, $state, $transitions, toastr, User, Country, Product, Team, Order, moment) {
    $scope.$storage = $localStorage;

    $scope.$storage.checkedUser = ($scope.$storage.checkedUser !== undefined) ? $scope.$storage.checkedUser : false;
    $scope.$storage.checkedInscription = ($scope.$storage.checkedInscription !== undefined) ? $scope.$storage.checkedInscription : false;
    $scope.$storage.countries = ($scope.$storage.countries !== undefined) ? $scope.$storage.countries : Country.query();

    $scope.countries = $scope.$storage.countries;
    $scope.formData = {
      teamCheck: false, // Doit être passé à true par les fonctions de tests du nom de team !!!
      checked_legal: false, // Doit être passé à true par les fonctions de tests des consentements !!!
      team: null,
      products: {
        tournament: {},
        burger: {
          id:5,
          amout:'0'
        },
        bfast:{
          id: 6,
          amount: '0'
        }
      },
      consent: {
        cable: false,
        rules: false
      }
    };
    $scope.payload = undefined;

    $scope.paypalInfos = {
      business:'tresorier@festigeek.ch',
      item_name: 'toto',
      item_number:'lan2017',
      currency_code:'CHF',
      no_note: 'toto'
    };

    // GET API

    $scope.formData.infosUser = User.get({ id: 'me' }, function(e) {
        var $now = moment();
        var $age = $now.diff(moment(e.birthdate), 'years');
        if($age >=18){
        $scope.birthdate = false;
      }
      else {
            $scope.birthdate = true;
      }
      });



    $scope.existingTeams = Team.query({event_id: 1});
    $scope.gameProducts = Product.query({type_id: 1}, function(){
      $scope.gameProducts.forEach(function(gameProduct){
        gameProduct.available = gameProduct.quantity_max - gameProduct.sold;

      });


    });

    $scope.mealProducts = Product.query({type: 'repas'});

    // FUNCTIONS

    // Fonction s'assurant que le compte de l'utilisateur a été mis à jour
    var updateUser = function() {
      $scope.formData.infosUser.$update(function () {
          toastr.info('Profil mis à jour.');
          return true;
        },
        function() {
          toastr.error('Erreur lors de la mise à jour du profil.');
          return false;
        });
    };

    //
    $scope.needTeam = function(){

      if($scope.formData.products.tournament.need_team == 1){

        return true;
      }else {
        return false;
      }
    }

    $scope.viewBattleTag = function(){
      console.log($scope.formData.products.tournament.name );
      if($scope.formData.products.tournament.name == 'Overwatch'){

        return true;
      }else {
        return false;
      }
    }

    $scope.viewLoL = function(){
      console.log($scope.formData.products.tournament.name );
      if($scope.formData.products.tournament.name == 'League Of Legend'){

        return true;
      }else {
        return false;
      }
    }

    // Fonction s'assurant que le formulaire d'inscription est complet
    var inscriptionComplete = function() {
      return $scope.formData.consent.cable && $scope.formData.consent.rules && $scope.formData.checked_legal && $scope.formData.teamCheck && $scope.formData.products.tournament.id;
    };

    // Fonction mettant à jour le payload de l'inscription
    var updatePayload = function() {
      $scope.payload = {
        event_id: 1,
        checked_legal: $scope.formData.checked_legal,
        team: $scope.formData.team,
        products: [
          {
            product_id: $scope.formData.products.tournament.id,
            amount: 1
          },
          {
            product_id: 5,
            amount: $scope.formData.products.burger.amout
          },
          {
            product_id: 6,
            amount: $scope.formData.products.bfast.amount
          }
        ]
      };

    };

    // Fonction permettant de soumettre la commande (inscription)
    $scope.postOrder = function(type) {
      if($scope.$storage.checkedUser && $scope.$storage.checkedInscription) {
        $scope.payload.payment_type_id = type;
        var newOrder = new Order($scope.payload);
        newOrder.$save().$promise
          .then(function() {
            // TODO: Commande OK -> $state.go('inscriptions_result')
          })
          .catch(function() {
            // TODO: Commande KO ->
            toastr.error('Erreur lors de l\'envoi de l\'inscription.');
          });
      }
      else {
        toastr.warning('Impossible d\'effectuer l\'inscription, coordonnées incomplètes.', 'Données utilisateurs');
      }
    };

    // EVENTS

    // Conditions pour atteindre l'état .games depuis .infos
    $transitions.onBefore({to: 'inscriptions.games', from: 'inscriptions.infos'}, function(){
      if(!$scope.formData.infosUser.is_consistent()) {
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
      if(!$scope.formData.infosUser.is_consistent() || !inscriptionComplete()) {
        toastr.warning('Impossible d\'accéder à la page de paiement, données incomplètes.', 'Données manquantes');
        return false;
      }
    });

    // Lors de l'accès à l'état .payment
    $transitions.onStart({to: 'inscriptions.payment'}, function(trans){
      if(trans.from.name === 'inscriptions.infos') {
        updateUser();
      }
      updatePayload();
    });

    // DEBUG

    $rootScope.dataDebug.formData = $scope.formData;

    // MOCK DATA

    // $scope.gameProducts = [
    //   {id:1, name:'Animations', max:1, price: 20.00},
    //   {id:2, name:'Counter-Strike: Global Offensive', max:1, price: 20.00},
    //   {id:3, name:'League of Legends', max:1, price: 20.00},
    //   {id:4, name:'Overwatch', max:1, price: 20.00}
    // ];

    // $scope.otherProducts = [
    //   {id:1, name:'Burger', max: 4, price: 13.00},
    //   {id:2, name:'Petit-dej', max: 2, price: 5.00}
    // ];

    // $scope.existingTeams = [
    //   {id:1, name:'CouCouchClan'},
    //   {id:2, name:'Les zebis'},
    //   {id:3, name:'TrololoBoyz'},
    //   {id:4, name:'Boloss United'}
    // ];
  });
