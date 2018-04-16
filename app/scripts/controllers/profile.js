'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('ProfileCtrl', function ($log, $window, $http, urls, $scope, $auth, $location, $localStorage, toastr, User, Country, Order, Team) {
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

    // Download du ticket en PDF
    $scope.getTicket = function() {
      $http({
        method: 'GET', 
        url: urls.BASE_API + '/orders/' + $scope.orders[0].id + '?format=pdf',
        headers : {
          'Content-type' : 'application/pdf'
        },
        responseType : 'arraybuffer'})
        .then(function(res) {
          $log.log(res);
          var pdfFile = new Blob([ res.data ], {
            type : 'application/pdf'
          });

          $window.open(URL.createObjectURL(pdfFile));
          // var anchor = angular.element('<a/>');
          // var header = 'data:application/octet-binary;charset=utf-8,';

          // anchor.attr({
          //   href: header + encodeURI(data),
          //   target: '_blank',
          //   download: 'ticket_festigeek_2018.pdf'
          // })[0].click();
        })
        .catch(function(data){
          $log.error(data);
        });
    };

    // Copy team code in clipboard
    // $scope.copyCode = function() {
    //   var $temp = $('h3');
    //   $('body').append($temp);
    //   $temp.val($(element).text()).select();
    //   document.execCommand('copy');
    //   $temp.remove();
    //
    //   toastr.success('Code copié dans le presse papier');
    //
    //   console.log('click!')
    // }


    $scope.updateUser = function() {
      User.update($scope.user).$promise
        .then(function() {
          $scope.$storage.checkedUser = true;
          toastr.success('Profil mis à jour avec succès !');
        });
    };

    $scope.changeCaptain = function(email) {
      var team = new Team({'captain':email});
      team.$modifyTeam({ event_id:2, team_id: $scope.team.id }, function() {
        if(true){
          toastr.success('Capitaine mis à jour!');
        }
      }, function(err){
        $log.log(err);
      });

    };

    $scope.checkLastMail = function() {
      return ($localStorage.lastMail === undefined || (new Date()).getTime() > $localStorage.lastMail);
    };

    $scope.getBankTransfertMail = function() {
      if($scope.checkLastMail()) {
        $http({
            method: 'GET',
            url: urls.BASE_API + '/orders/' + $scope.orders[0].id + '/getPayment?paymentType=1'
          })
          .then(function(res) {
            $log.log(res);
            toastr.success('Mail envoyé !');
            $localStorage.lastMail = (new Date()).getTime() + 900000;
          })
          .catch(function(data){
            toastr.warning('Une erreur est survenue, merci de contacter un admin.');
            $log.error(data);
          });
      }
      else {
        var time = (new Date($localStorage.lastMail - (new Date()).getTime())).getMinutes();
        toastr.warning("Merci d'attendre " + time + ' minutes avant de réessayer.');
      }
    };


    $scope.getPaypalInvoice = function() {
      $http({
        method: 'GET', 
        url: urls.BASE_API + '/orders/' + $scope.orders[0].id + '/getPayment?paymentType=2'
      })
      .then(function(res) {
        $log.log(res);
        $window.open(res.data.link, '_self');
      })
      .catch(function(data){
        toastr.warning('Une erreur est survenue, merci de contacter un admin.');
        $log.error(data);
      });
    };

    // ADMIN

    $scope.getAllOrders = function(format) {
      $http({method: 'GET', url: urls.BASE_API + '/orders?format=' + format})
        .then(function(res) {
          $log.log(res);
          var anchor = angular.element('<a/>');
          var header = (format === 'csv') ? 'data:attachment/csv;charset=utf-8,' : 'data:attachment/json;charset=utf-8,';
          var href = (format === 'csv') ? header + encodeURI( res.data ) : header + encodeURI(JSON.stringify(res.data ));

          anchor.attr({
            href: href,
            target: '_blank',
            download: 'orders.' + format
          })[0].click();
        })
        .catch(function(data){
          $log.error(data);
        });
    };

    $scope.generateStats = function() {
      $scope.orderStats = Order.getByEvent(2, function(orders){
        $scope.testingmotherfuckingShit = orders;
      }, function(log){
        $log.log(log);
      });
    };

  });
