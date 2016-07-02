'use strict';

describe('Service: fgErrorCatcher', function () {

  // load the service's module
  beforeEach(module('frontGeekApp'));

  // instantiate service
  var fgErrorCatcher;
  beforeEach(inject(function (_fgErrorCatcher_) {
    fgErrorCatcher = _fgErrorCatcher_;
  }));

  it('should do something', function () {
    expect(!!fgErrorCatcher).toBe(true);
  });

});
