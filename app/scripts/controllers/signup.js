'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('SignupCtrl', function (urls, $scope, $http, $auth, $location, uibDateParser, toastr) {
    // Control datepicker
    $scope.isDatepickerOpen = false;
    $scope.dateFormat = 'dd.MM.yyyy';

    $scope.openDatepicker = function() {
      $scope.isDatepickerOpen = true;
    };

    // 3. Errors / Succes handling

    // Register
    $scope.signup = function() {
      $scope.user.birthdate = $scope.user.birthdate.getFullYear() + '-' + ('0' + ($scope.user.birthdate.getMonth() + 1)).slice(-2) +  '-' + $scope.user.birthdate.getDate();
      $http({
        url: urls.BASE_API + '/users',
        method: 'POST',
        data: $scope.user
      }).then(function(response) {
        $auth.setToken(response.data.token);
        toastr.success('Un lien d\'activation vous a été envoyé par e-mail', 'Création de votre compte réussie !', {
          closeButton: true
        });
        $location.path('/');
      }, function(error) {
        console.log(error.data);
      });
    };

  });
