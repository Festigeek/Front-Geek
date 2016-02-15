'use strict';

/**
 * @ngdoc overview
 * @name frontGeekApp
 * @description
 * # frontGeekApp
 *
 * Main module of the application.
 */
angular
  .module('frontGeekApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngDialog',
    'angular-jwt',
  ])
  .constant('urls', {
    BASE: 'http://localhost:9000/',
    BASE_API: 'http://localhost/v1'
  })
  .config(function ($routeProvider, $httpProvider, jwtInterceptorProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .otherwise({
        redirectTo: '/'
      });

    // Please note we're annotating the function so that the $injector works when the file is minified
    jwtInterceptorProvider.tokenGetter = function() {
      return localStorage.getItem('JWT');
      var refreshToken = localStorage.getItem('refresh_token');
      if (jwtHelper.isTokenExpired(jwt)) {
        // This is a promise of a JWT id_token
        return $http({
          url: '/delegation',
          // This will not send the JWT for this call
          skipAuthorization: true,
          method: 'POST',
          refresh_token : refreshToken
        })
        .then(function(response) {
          localStorage.setItem('JWT', response.data.jwt);
          return jwt;
        });
      }
      else return jwt;
    }

    $httpProvider.interceptors.push('jwtInterceptor');
  });
