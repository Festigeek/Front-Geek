'use strict';


angular.module('frontGeekApp')
  .controller('ForgotPasswordCtrl', function ($scope) {

    $scope.forgotpassword = function() {
      var newUser = new User($scope.user);
      $scope.resetPasswordResult = User.forgotpassword( function(name){
        toastr.success('Un mail t\'a été envoyé pour réinitialiser ton mot de passe. Vérifie ton dossier de spams!', 'Réinitialisation réussie !');
        ngDialog.closeAll();
      });

    };
  });
