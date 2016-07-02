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
    'ui.bootstrap',
    'angular-storage',
    'angular-jwt'
  ])
  .constant('urls', {
    BASE: 'http://localhost:9000',
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
      .when('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl',
        controllerAs: 'account',
        requiresLogin: true
      })
      .when('/inscription', {
        templateUrl: 'views/inscription.html',
        controller: 'InscriptionCtrl',
        controllerAs: 'inscription'
      })
      .otherwise({
        redirectTo: '/'
      });

    jwtInterceptorProvider.tokenGetter = function(aiStorage) {
      return aiStorage.get('token');
    };

    $httpProvider.interceptors.push('jwtInterceptor');
    $httpProvider.interceptors.push('fgErrorCatcher');
  })
  .run(function($rootScope, $location, urls, aiStorage, jwtHelper){
    /*
    // Variables 
    */

    $rootScope.ROUTES = urls;

    /*
    // Functions 
    */

    // Function to check if a token is stored
    $rootScope.haveToken = function() {
      return aiStorage.get('token') !== null;
    };

    // Function to active button on navBar
    $rootScope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
    };

    // Function to logout
    $rootScope.logout = function () { 
      aiStorage.remove('token');
      $location.path('/');
    };

    /*
    // Events 
    */

    $rootScope.$on('$routeChangeStart', function(e, to) {
      if (to.$$route.requiresLogin) {
        if (!aiStorage.get('token') || jwtHelper.isTokenExpired(aiStorage.get('token'))) {
          e.preventDefault();
          $location.path('login');
        }
      }
    });
  });
