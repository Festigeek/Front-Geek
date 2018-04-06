'use strict';

angular.module('frontGeekApp')
  .controller('ForgotPasswordCtrl', function ($scope, $log, User, toastr, ngDialog) {
    $scope.user = {};
    $scope.forgotPassword = function() {
      var newUser = new User($scope.user);
      newUser.$forgotPassword(function() {
        toastr.success("Un mail t'a été envoyé pour réinitialiser ton mot de passe. N'oublie pas de vérifier ton dossier de spams !", 'Mail envoyé !');
        ngDialog.closeAll();
      }, function() {
        toastr.error('Aucun compte correspondant à cette adresse e-mail...', 'Erreur !');
      });
    };
  });
