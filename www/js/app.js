// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'LocalStorageModule', 'ngWebSocket', 'angularMoment', 'ui.router'])

.run(function( $ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);


    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html'
  })
  .state('register', {
    url: '/signup',
    templateUrl: 'templates/register.html'
  })
  .state('rooms', {
    url: '/rooms',
    templateUrl: 'templates/rooms.html',
    // resolve: {
    //   authorize: checkAuth
    // }
  })

  .state('room', {
    url: '/room',
    templateUrl: 'templates/room.html',
    // resolve: {
    //   authorize: checkAuth
    // }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/rooms');
  $httpProvider.interceptors.push(function($q,$location, $timeout, localStorageService) {
      return {
          'request': function (config) {
              config.headers = config.headers || {};
              if (localStorageService.get('username') && localStorageService.get('username') != '' && localStorageService.get('token') && localStorageService.get('token') != ''  ) {
                  config.headers.Authorization = "Token " + localStorageService.get('token');
              }
              return config;
          },
          'responseError': function(response) {
              if(response.status === 401 || response.status === 403) {
                  $timeout($location.path('/#/login'), 50);
              }
              return $q.reject(response);
          }
      };
  });

});

// function checkAuth($q, AuthService, $state, $timeout) {
//   if (AuthService.isAuthenticated()) {
//     // Resolve the promise successfully
//     return $q.when();
//   } else {
//     $timeout(function() {
//       $state.go('login');
//     })

//     // Reject the authentication promise to prevent the state from loading
//     return $q.reject();
//   }
// }
