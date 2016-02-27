'use strict';

/**
 * @ngdoc function
 * @name frontGeekApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('AboutCtrl', function (aiStorage) {
    console.log(aiStorage.get('token'));
  });
