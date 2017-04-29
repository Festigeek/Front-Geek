'use strict';

/**
 * @ngdoc service
 * @name frontGeekApp.User
 * @description
 * # Country
 * Factory in the frontGeekApp.
 */
angular.module('frontGeekApp')
  .factory('Team', function (urls, $resource) {
    // Team service used to communicate with the team ressource (by event) of the API
    return $resource(urls.BASE_API + '/events/:event_id/teams', { event_id: '@event_id' });
  });
