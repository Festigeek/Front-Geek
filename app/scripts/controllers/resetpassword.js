'use strict';

angular.module('frontGeekApp')
  .controller('ResetPasswordCtrl', function ($scope, $log, $stateParams, User, toastr, ngDialog, resetToken) {
    $scope.user = {
      'reset_token': resetToken
    };
    $scope.resetPassword = function() {
      var newPass = new User($scope.user);
      newPass.$resetPassword($scope.resetInfos, function() {
        toastr.success('Ton mot de passe a été réinitialisé. Tu peu désormais te reconnecter.', 'Réinitialisation réussie !');
        ngDialog.closeAll();
      }, function() {
        toastr.error('Erreur lors de la réinitialisation du mot de passe...', 'Erreur !');
      });
    };
  });
