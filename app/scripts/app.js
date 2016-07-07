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
    'ngSanitize',
    'ngTouch',
    'ngDialog',
    'ui.bootstrap',
    'ui.router',
    'satellizer',
    'toastr'
  ])
  .constant('urls', {
    BASE: 'http://localhost:9000',
    BASE_API: 'http://localhost/v1'
  })
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $authProvider, urls, $injector) {
    $authProvider.loginUrl = urls.BASE_API + '/users/login';
    $authProvider.signupUrl = urls.BASE_API + '/users';
  
    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }
  
    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } 
      else {
        $location.path('/login');
      }
      
      return deferred.promise;
    }
  
    $stateProvider
      .state('main', {
        url: '/',
        controller: 'MainCtrl',
        templateUrl: 'views/main.html'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      });

    $urlRouterProvider.otherwise('/');
    $httpProvider.interceptors.push('fgErrorCatcher');
  })
  .run(function($rootScope, $location, urls, $auth){
    /*
    // Variables 
    */

    /*
    // Functions 
    */
    $rootScope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    // Function to active button on navBar
    $rootScope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
    };
  });
