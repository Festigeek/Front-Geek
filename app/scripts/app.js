'use strict';
/* global $ */

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
    'picardy.fontawesome',
    'ui.router',
    'satellizer',
    'toastr',
    'vcRecaptcha',
    'duScroll',
    'angucomplete-alt',
    'ui.select',
    'ngCart'
  ])
  .constant('urls', {
    BASE: 'http://localhost:9000',
    BASE_API: 'http://localhost/v1'
  })
  .value('duScrollEasing', function (t) { return t<0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;})
  .value('duScrollDuration', 1500)
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $authProvider, toastrConfig, urls) {
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

    angular.extend(toastrConfig, {
      timeOut: 1000
    });

    $stateProvider
      .state('main', {
        url: '/',
        controller: 'MainCtrl',
        templateUrl: 'views/main.html'
      })
      .state('missing', {
        url: '/missing',
        templateUrl: '404.html'
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
      })
      .state('inscriptions', {
        url: '/inscriptions',
        templateUrl: 'views/inscriptions.html',
        controller: 'InscriptionCtrl'
      })
      .state('inscriptions.infos', {
        url: '/infos',
        templateUrl: 'views/partials/inscriptions_infos.html',
      })
      .state('inscriptions.games', {
        url: '/games',
        templateUrl: 'views/partials/inscriptions_games.html',
      })
      .state('inscriptions.payment', {
        url: '/payment',
        templateUrl: 'views/partials/inscriptions_payment.html',
      });

    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/missing');
    $httpProvider.interceptors.push('errorCatcher');
  })
  .run(function($rootScope, $location, urls, $auth, ngDialog, toastr/*, User*/){
    /*
    // Variables
    */
    $rootScope.user = {};
    $rootScope.dialog = undefined;
    $rootScope.dataDebug = { user: $rootScope.user };

    /*
    // Functions
    */
    $rootScope.openLogin = function() {
      if($rootScope.dialog !== undefined) {
        $rootScope.dialog.close();
      }

      //TODO: try Bootstrap modal (https://angular-ui.github.io/bootstrap)
      $rootScope.dialog = ngDialog.open({
        template: 'views/partials/login.html',
        controller: 'LoginCtrl'
      });
    };

    $rootScope.openSignup = function() {
      if($rootScope.dialog !== undefined) {
        $rootScope.dialog.close();
      }

      $rootScope.dialog = ngDialog.open({
        template: 'views/partials/signup.html',
        controller: 'SignupCtrl'
      });
    };

    $rootScope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $rootScope.logout = function() {
      if ($auth.isAuthenticated()) {
        $auth.logout()
          .then(function () {
            toastr.info('Vous vous être déconnecté avec succès');
            $location.path('/');
          });
      }
    };

    // Function to active button on navBar
    $rootScope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    /*
     // Events
     */
    $rootScope.$on('$routeChangeError', function() {
      $location.path('/missing');
    });

    // TODO: Transformer ce qui suit en directive
    // Click outside of the Mobile Menu
    $(document).click(function (e) {
      var container = $('#navigationbar');
      if (!container.is(e.target) && container.has(e.target).length === 0 && container.hasClass('in')) {
        $('#mobile_button').click();
      }
    });

    $('#navigationbar a').click(function (e) {
      var container = $('#navigationbar');
      if (container.hasClass('in') && !e.target.hasClass('dropdown-toggle')) {
        $('#mobile_button').click();
      }
    });

    $('.dropdown-menu a').click(function ( ) {
      var submenu = $('.dropdown-menu');
      if(submenu.hasClass('open')) {
        submenu.removeClass('open');
      }
    });
  });
