'use strict';

/**
 * @ngdoc directive
 * @name frontGeekApp.directive:confirmPassword
 * @description
 * # confirmPassword
 */
angular.module('frontGeekApp')
  .directive('confirmPassword', function () {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {
        ctrl.$validators.noMatch = function(modelValue, viewValue) {
          var test = false;

          if(scope.newPassForm !== undefined) {
            test = viewValue === scope.newPassForm.newPassword.$viewValue;
          }

          if(scope.registerForm !== undefined) {
            test = viewValue === scope.registerForm.password.$viewValue;
          }

          return test;
        };
      }
    };
  });
