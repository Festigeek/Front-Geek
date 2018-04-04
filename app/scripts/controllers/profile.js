'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('ProfileCtrl', function ($log, urls, $scope, $auth, $location, $localStorage, toastr, User, Country, Order, Team) {
    $scope.subPage = 1;

    $scope.$storage = $localStorage;
    $scope.$storage.countries = ($scope.$storage.countries !== undefined) ? $scope.$storage.countries : Country.query();
    $scope.countries = $scope.$storage.countries;
    $scope.user = {};
    $scope.updateTeam = {};
    $scope.isCaptain = false;

    User.get({ id: 'me' }, function(user) {
      $scope.user = user;
      Order.getFromUser({ user_id: user.id }, function(orders) {
        $scope.orders = orders.filter(function(order) {return order.event_id === 2;});
        Team.getUserTeam({ order_id: $scope.orders[0].id }, function(team) {
          $scope.team = team;
          $scope.testingFilter = $scope.team.users.filter(function(user){return user.email === $scope.user.email;});

          if($scope.testingFilter[0].captain === true){
            $scope.isCaptain = true;
          }
        }, function(team){
          $log.log(team); //TODO if null
        });
      });


    });

    $scope.getTicket = function() {
      window.location.href = urls.BASE_API + '/orders/' + $scope.orders[0].id + '?format=pdf&token=' + $auth.getToken();
    };

    // $scope.copyCode = function() {
    //   var $temp = $("h3");
    //   $("body").append($temp);
    //   $temp.val($(element).text()).select();
    //   document.execCommand("copy");
    //   $temp.remove();
    //
    //   toastr.success('Code copié dans le presse papier');
    //
    //   console.log("click!")
    // }


    $scope.updateUser = function() {
      User.update($scope.user).$promise
        .then(function() {
          $scope.$storage.checkedUser = true;
          toastr.success('Profil mis à jour avec succès !');
        });
    };

    $scope.changeCaptain = function() {
      
      //TODO how the fuck do i do this payload...
      Team.modifyTeam({ order_id: $scope.orders[0].id, team_id: $scope.team.id }, function(team){
        $scope.motherfucker = team;
      }, function(err){
        $log.log(err);
      });

    };
  });
