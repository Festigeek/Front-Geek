'use strict';

describe('Controller: InscriptionCtrl', function () {

  // load the controller's module
  beforeEach(module('frontGeekApp'));

  var InscriptionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InscriptionCtrl = $controller('InscriptionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});
