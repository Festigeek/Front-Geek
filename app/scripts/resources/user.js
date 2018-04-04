'use strict';

/**
 * @ngdoc service
 * @name frontGeekApp.User
 * @description
 * # User
 * Factory in the frontGeekApp.
 */
angular.module('frontGeekApp')
  .factory('User', function (urls, $resource) {
    // User service used to communicate with the user ressource of the API
    var User = $resource(urls.BASE_API + '/users/:id', { id: '@id' }, {
      'login': { method: 'POST' },
      'update': { method: 'PUT' },
      'forgotpassword' : {
        url: urls.BASE_API + '/users/getResetToken',
        method: 'POST',
        isArray: true
      },
    });


    // Vérifie si l'utilisateur a renseigné toutes les informations nécessaires
    User.prototype.is_consistent = function() {
      return this.gender && this.firstname && this.lastname && this.country_id && this.street && this.npa && this.city;
    };

    return User;
  });
