'use strict';

/**
 * @ngdoc directive
 * @name frontGeekApp.directive:confirmPassword
 * @description
 * # confirmPassword
 */
angular.module('frontGeekApp')
  .directive('passwordMatch', function () {
    return {
      require: 'ngModel',
      scope: {
        otherModelValue: '=passwordMatch'
      },
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue === scope.otherModelValue;
        };
        scope.$watch('otherModelValue', function() {
          ngModel.$validate();
        });
      }
    };
  });
