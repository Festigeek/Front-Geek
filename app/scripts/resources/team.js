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
    var Team = $resource(urls.BASE_API + '/events/:event_id/teams', { event_id: '@event_id' }, {
      'getTeams':{
        url: urls.BASE_API + '/events/:event_id/teams',
        method: 'GET',
        params:  { event_id: '@event_id' },
        isArray: true
      },
      'getUserTeam':{
        url: urls.BASE_API + '/orders/:order_id/team',
        method: 'GET',
        params:  { order_id: '@order_id' }
      },
      'modifyTeam': {
        url: urls.BASE_API + '/events/:event_id/teams/:team_id',
        method: 'PUT',
        params: { event_id: '@event_id', team_id: '@team_id' }
      },
      'testCode' : {
        url: urls.BASE_API + '/events/:event_id/teams/:team_code',
        method: 'GET',
        params:  { event_id: '@event_id', team_code: '@team_code' }
      },
    });
    // Team service used to communicate with the team ressource (by event) of the API
    return Team;
  });
