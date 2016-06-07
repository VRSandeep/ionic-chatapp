(function(){

    angular.module('starter')
    .factory('AuthService', function($http, $q, localStorageService) {
        var authservice = {};
        authservice.loginUser = function(name, pw) {
            return $http.post('http://localhost:8000/accounts/login/', {
                "username": name,
                "password": pw
            }).then(function(response) {
                localStorageService.set('username', name);
                localStorageService.set('token', response.key);
            }, function(response) {
                return $q.reject(response.data);
            });
        };

        authservice.registerUser = function(name, pw) {
            return $http.post('http://localhost:8000/accounts/register/', {
                "username": name,
                "password": pw
            }).then(function(response) {
                localStorageService.set('username', name);
                localStorageService.set('token', response.key);
            }, function(response) {
                return $q.reject(response.data);
            });
        };
        authservice.isAuthenticated = function () {
            if (localStorageService.get('username') && localStorageService.get('username') != '' && localStorageService.get('token') != ''  ) {
                return true;
            } return false;
        };
        authservice.logout = function () {
            return localStorageService.clearAll();
        };
        return authservice;

    });
})();
