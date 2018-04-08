'use strict';
/* global $ */

/**
 * @ngdoc function
 * @name frontGeekApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontGeekApp
 */
angular.module('frontGeekApp')
  .controller('MainCtrl', function ($window, $state, $stateParams, $scope, ngDialog) {
    // Imported from 2016 One-Page site
    $scope.parallax = function() {
      $(window).stellar();
    };

    /*
    // Scrolling Animations
    $scope.contentWayPoint = function() {

      var elements = angular.element(document.getElementsByClassName('animate-box'));
      var waypointAction = function(direction) {
        if (direction === 'down' && !$(this.element).hasClass('animated')) {

          $(this.element).addClass('item-animate');
          setTimeout(function () {

            $('body .animate-box.item-animate').each(function (k) {
              var el = $(this);
              setTimeout(function () {
                el.addClass('fadeInUp animated');
                el.removeClass('item-animate');
              }, k * 50, 'easeInOutExpo');
            });
          }, 100);
        }
      };

      for (var i = 0; i < elements.length; i++) {
        new $window.Waypoint({
          element: elements[i],
          handler: waypointAction,
          offset: '85%'
        });
      }
    };
    */

    /*
    // FORM VALIDATOR
    $scope.formValidator = function() {
      $('#contact-form').validator();

      $('#contact-form').on('submit', function (e) {
        if (!e.isDefaultPrevented()) {
          var url = 'contact.php';

          $.ajax({
            type: 'POST',
            url: url,
            data: $(this).serialize(),
            success: function (data)
            {
              //console.log(data);

              var messageAlert = 'alert-' + data.type;
              var messageText = data.message;

              var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
              if (messageAlert && messageText) {
                $('#contact-form').find('.messages').html(alertBox);
              }

              if(data.type === 'success'){
                $('#contact-form')[0].reset();
              }

              $scope.grecaptcha.reset();
            }
          });
          return false;
        }
      });
    };
    */

    if($state.current.name === 'resetPassword'){
      ngDialog.open({
        templateUrl: 'views/partials/resetpassword.html',
        controller: 'ResetPasswordCtrl',
        resolve: {
          resetToken: function() {
            return $stateParams.token;
          },
          resetMail: function() {
            return $stateParams.email;
          }
        }
      });
    }

    $scope.initOnePage = function() {
      $scope.parallax();
      // $scope.contentWayPoint();

      // Added by Mysteriosis
      // $scope.formValidator(); // FORM VALIDATOR
    };

    $scope.openInscriptions = function(){
      $state.go('inscriptions');
    };

    // Onload functions execution
  //  $rootScope.openModal();
    $scope.initOnePage();
  });
