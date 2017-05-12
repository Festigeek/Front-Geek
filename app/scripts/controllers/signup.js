'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('SignupCtrl', function (urls, $scope, $http, $auth, $location, uibDateParser, ngDialog, toastr, User) {
    // Control datepicker
    $scope.isDatepickerOpen = false;
    $scope.dateFormat = 'dd.MM.yyyy';

    $scope.openDatepicker = function() {
      $scope.isDatepickerOpen = true;
    };

    // 3. Errors / Succes handling

    // Register
    $scope.signup = function() {
      var newUser = new User($scope.user);
      newUser.birthdate = $scope.user.birthdate.getFullYear() + '-' + ('0' + ($scope.user.birthdate.getMonth() + 1)).slice(-2) + '-' + $scope.user.birthdate.getDate();
      newUser.$save(function() {
          toastr.success('Un lien d\'activation vous a été envoyé par e-mail. Vérifiez votre dossier de spams!', 'Création de votre compte réussie !');
          ngDialog.closeAll();
        }, function(err) {
          if(err.status === 409){
            toastr.error('Il existe déjà un compte avec ces identifiants.');
          }
          else {
            toastr.error('Échec de la création de compte.');
          }
      });
    };

  });
