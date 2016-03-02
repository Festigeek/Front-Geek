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
          return viewValue === scope.registerForm.password.$viewValue;
        };
      }
    };
  });
