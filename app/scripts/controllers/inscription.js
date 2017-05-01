'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:InscriptionCtrl
 * @description
 * # InscriptionCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('InscriptionCtrl', function ($rootScope, $scope, $state, $localStorage, toastr, User, Country, Product, Team, Order) {
    $scope.$storage = $localStorage;
    $scope.$storage.checkedUser = ($scope.$storage.checkedUser !== undefined) ? $scope.$storage.checkedUser : false;
    $scope.$storage.checkedInscription = ($scope.$storage.checkedInscription !== undefined) ? $scope.$storage.checkedInscription : false;
    $scope.$storage.countries = ($scope.$storage.countries !== undefined) ? $scope.$storage.countries : Country.query();

    $scope.countries = $scope.$storage.countries;
    $scope.formData = {
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
    User.get({ id: 'me' }, function(user) {
      $scope.formData.infosUser = user;
    });

    $scope.existingTeams = Team.query({event_id: 1});
    $scope.gameProducts = Product.query({type_id: 1});
    $scope.mealProducts = Product.query({type: 'repas'});

    // FUNCTIONS

    // Fonction vérifiant le changment de page
    $scope.goTo = function(dest, form, source, callback) {
      // TODO: Pas encore top
      console.log(dest, form, source);
      if($state.current.name === source && form !== undefined && form.$invalid) {
        toastr.warning('Merci de vérifier le contenu du formulaire', 'Données incomplètes');
      }
      else {
        if(callback !== undefined && callback()) {
          $state.go(dest);
        }
      }
    };

    // Fonction s'assurant que le compte de l'utilisateur est complet (renvoi un booléen)
    $scope.updateUser = function() {
      if(!$scope.$storage.checkedUser) {
        User.update({id: 'me'}, $scope.formData.infosUser).$promise
          .then(function () {
            toastr.info('Profil mis à jour.');
            $scope.$storage.checkedUser = true;
            return true;
          })
          .catch(function() {
            toastr.error('Erreur lors de la mise à jour du profil.');
            return false;
          });
      }
      else {
        return true;
      }
    };

    // Fonction s'assurant que le formulaire d'inscription a bien été rempli (renvoi un booléen)
    $scope.updateInscription = function() {
      if(!$scope.$storage.checkedInscription) {
        if ($scope.formData.consent.cable && $scope.formData.consent.rules && $scope.formData.team && $scope.formData.products.tournament.id) {
          $scope.payload = {
            event_id: 1,
            checked_legal: true,
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
          $scope.$storage.checkedInscription = true;
        }
        else {
          return false;
        }
      }
      else {
        return true;
      }
    };

    $scope.postOrder = function(type) {
      if($scope.$storage.checkedUser && $scope.$storage.checkedInscription) {
        $scope.payload.payment_type_id = type;
        var newOrder = new Order($scope.payload);
        newOrder.$save().$promise
          .then(function() {

          })
          .catch(function() {

          });
      }
      else {
        toastr.warning('Impossible d\'effectuer l\'inscription, coordonnées incomplètes.', 'Données utilisateurs');
      }
    };

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
