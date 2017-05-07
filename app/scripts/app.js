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
    'ngStorage',
    'angular-loading-bar',
    'ui.bootstrap',
    'ui.router',
    'ui.select',
    'picardy.fontawesome',
    'satellizer',
    'toastr',
    'vcRecaptcha',
    'duScroll',
    'angucomplete-alt',
    'angularMoment'
  ])

  // CONSTANTS
  .constant('urls', {
    BASE: 'https://www.festigeek.ch',
    BASE_API: 'https://api.festigeek.ch/v1'
    // BASE: 'http://localhost:9000',
    // BASE_API: 'http://127.0.0.1:8080/v1'
  })
  .constant('newsModal', 'inscriptions2017')

  // VARIABLES
  .value('duScrollEasing', function (t) { return t<0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;})
  .value('duScrollDuration', 1500)

  // CONFIGURATIONS
  .config(function ($qProvider, $stateProvider, $urlRouterProvider, $httpProvider, $authProvider, urls, toastrConfig) {
    $qProvider.errorOnUnhandledRejections(false);
    angular.extend(toastrConfig, {
      timeOut: 1500,
      positionClass: 'toast-top-center',
      preventOpenDuplicates: true
    });

    // CONFIG SATELLIZER
    $authProvider.loginUrl = urls.BASE_API + '/users/login';
    $authProvider.signupUrl = urls.BASE_API + '/users';

    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      }
      else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    var serverRequired = ['$q', '$location', 'checkServer', 'toastr', function ($q, $location, checkServer, toastr) {
      var deferred = $q.defer();

      checkServer()
        .then(function(){
            deferred.resolve();
        })
        .catch(function(){
          deferred.reject();
          $location.path('/');
          toastr.error('Serveur indisponible.');
        });

      return deferred.promise;
    }];

    var loginRequired = ['$q', '$location', '$auth', 'toastr', function ($q, $location, $auth, toastr) {
      var deferred = $q.defer();
      if (!$auth.isAuthenticated()) {
        deferred.reject();
        $location.path('/');
        toastr.info('Connectez-vous pour accéder à cette page.');
      }
      else {
        deferred.resolve();
      }
      return deferred.promise;
    }];

    var previousOrder = ['$q', 'urls', '$location', '$auth', '$http', 'toastr', function ($q, urls, $location, $auth, $http, toastr) {
      var deferred = $q.defer();

      // TODO Fix 'undefined' in stateService.ts
      $http.get(urls.BASE_API + '/users/me/orders')
      .then(function(res){
        if(res.data.length > 0) {
          deferred.reject();
          $location.path('/');
          toastr.error('Vous avez déjà effectué votre inscription.');
        }
        else {
          deferred.resolve();
        }
      })
      .catch(function() {
        deferred.reject();
        $location.path('/');
      });

      return deferred.promise;
    }];

    // ROUTING
    $stateProvider
      .state('main', {
        url: '/',
        controller: 'MainCtrl',
        templateUrl: 'views/main.html'
      })
      .state('activate', {
        url: '/activate/:token',
        resolve: {
          serverRequired: serverRequired,
          activation: ['$http','$stateParams', 'toastr', '$state', function($http, $stateParams, toastr, $state) {
            return $http({
              method: 'GET',
              url: urls.BASE_API + '/users/activate',
              params: { activation_token: $stateParams.token }
            })
            .then(function (res) {
              if(res.data.success === 'user_activated') {
                toastr.success('Votre compte a été activé avec succès !');
              }
              else {
                toastr.success(res.data.success, res.statusText);
              }
            })
            .catch(function (res) {
              toastr.error(res.data.error, res.statusText);
            })
            .finally(function () {
              $state.go('main');
            });
          }]
        }
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
          serverRequired: serverRequired,
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        resolve: {
          serverRequired: serverRequired,
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
          serverRequired: serverRequired,
          loginRequired: loginRequired
        }
      })
      .state('inscriptions', {
        url: '/inscriptions',
        templateUrl: 'views/inscriptions.html',
        controller: 'InscriptionCtrl',
        redirectTo: 'inscriptions.infos',
        resolve: {
          serverRequired: serverRequired,
          loginRequired: loginRequired,
          previousOrder: previousOrder
        }
      })
      .state('inscriptions.infos', {
        url: '/infos',
        templateUrl: 'views/partials/inscriptions_infos.html'
      })
      .state('inscriptions.games', {
        url: '/games',
        templateUrl: 'views/partials/inscriptions_games.html'
      })
      .state('inscriptions.payment', {
        url: '/payment',
        templateUrl: 'views/partials/inscriptions_payment.html'
      })
      .state('checkout', {
        url: '/checkout?state',
        templateUrl: 'views/checkout.html',
        controller: 'CheckoutCtrl'
      });

    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/missing');
    $httpProvider.interceptors.push('errorCatcher');
  })

  // RUNNING CODE
  .run(function($rootScope, $location, $state, urls, newsModal, checkServer, $auth, $trace, $localStorage, ngDialog, toastr, amMoment){
    amMoment.changeLocale('fr-ch');

    /*
    // Variables
    */
    $rootScope.username = ($localStorage.loggedUser !== undefined) ? $localStorage.loggedUser.username : undefined;
    $rootScope.dialog = undefined;
    $rootScope.dataDebug = {};

    /*
    // Functions
    */
    $rootScope.openLogin = function() {
      checkServer()
        .then(function(){
          // if ($rootScope.dialog !== undefined) {
          //   $rootScope.dialog.close();
          // }
          ngDialog.closeAll();

          $rootScope.dialog = ngDialog.open({
            template: 'views/partials/login.html',
            controller: 'LoginCtrl'
          });
        })
        .catch(function(){
          toastr.error('Serveur indisponible.');
        });
    };

    $rootScope.openSignup = function() {
      checkServer()
        .then(function(){
          // if($rootScope.dialog !== undefined) {
          //   $rootScope.dialog.close();
          // }
          ngDialog.closeAll();

          $rootScope.dialog = ngDialog.open({
            template: 'views/partials/signup.html',
            controller: 'SignupCtrl'
          });
        })
        .catch(function(){
          toastr.error('Serveur indisponible.');
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
            delete $localStorage.checkedUser;
            $state.go('/');
          });
      }
    };

    // Function to active button on navBar
    $rootScope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    // Function to open pub modal
    $rootScope.closeModal = function() {
      ngDialog.closeAll();
    };

    $rootScope.openModal = function() {
      if(newsModal !== null) {
        $rootScope.dialog = ngDialog.open({
          template: 'views/partials/news/' + newsModal + '.html'
        });
      }
    };

    $rootScope.goInscriptions = function() {
      if($auth.isAuthenticated()) {
        ngDialog.closeAll();
        $state.go('inscriptions');
      }
      else {
        $rootScope.openLogin();
      }
    };

    /*
     // Events
     */
    $trace.enable('TRANSITION');

    // $rootScope.$on('$routeChangeError', function() {
    //   $state.go('/missing');
    // });

    // TODO: Transformer ce qui suit en directive
    // Click outside of the Mobile Menu
    $(document).click(function(e) {
      var container = $('#navigationbar');
      if (!container.is(e.target) && container.has(e.target).length === 0 && container.hasClass('in')) {
        $('#mobile_button').click();
      }
    });

    $('#navigationbar a').click(function(e) {
      var container = $('#navigationbar');
      if (container.hasClass('in') && !e.target.hasClass('dropdown-toggle')) {
        $('#mobile_button').click();
      }
    });

    $('ul.dropdown-menu li a').click(function() {
      console.log('TOTO');
      var submenu = $('.dropdown-menu');
      if(submenu.hasClass('open')) {
        submenu.removeClass('open');
      }
    });

    // NEWS MODAL
    $rootScope.openModal();
  });
