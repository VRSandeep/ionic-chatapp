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
    url: '/room',
    templateUrl: 'templates/rooms.html'
  })

  .state('room', {
    url: '/room/:roomid',
    templateUrl: 'templates/room.html'
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/room');

  // Add Token Authentication header to all HTTP requests
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
                  localStorageService.remove('username');
                  localStorageService.remove('token');
                  $location.path('login')
              }
              return $q.reject(response);
          }
      };
  });

});
