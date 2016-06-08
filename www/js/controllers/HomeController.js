(function(){
	angular.module('starter')
	.controller('HomeController', ['$scope', '$state', '$timeout', '$ionicPopup', '$ionicLoading', '$ionicHistory', 'localStorageService', 'AuthService', HomeController]);

	function HomeController($scope, $state, $timeout,$ionicPopup, $ionicLoading, $ionicHistory, localStorageService, AuthService){

		if (AuthService.isAuthenticated()) {
			$state.go('rooms');
		} else {
			if ($state.current.name !='register') {
				$state.go('login');
			}
		}

		var me = this;

		localStorageService.remove('room');
		localStorageService.remove('room-title');
		me.rooms = {
			"Public": "public",
			"Room 1": "room1",
			"Room 2": "room2"
		};

		me.show_login_form = true;

		$scope.login = function(username, password){
			AuthService.loginUser(username, password).then(function(data) {
	            $state.go('rooms');
	        }, function(error) {
	        	console.error(error);
	            $ionicPopup.alert({
	                title: 'Login failed!',
	                template: 'Please check your credentials!'
	            });
	        });
		};
		$scope.register = function(username, password){
			AuthService.registerUser(username, password).then(function(data) {
	            $state.go('rooms');
	        }, function(error) {
	        	console.error(error);
	            $ionicPopup.alert({
	                title: 'Registration failed!',
	                template: 'Username is already taken. Please select another username!'
	            });
	        });
		};

		$scope.logout = function () {
			AuthService.logout();
			$ionicLoading.show({template:'Logging out....'});

			$timeout(function () {
			   $ionicLoading.hide();
			   $ionicHistory.clearCache();
			   $ionicHistory.clearHistory();
			   $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
			   $state.go('login');
			   }, 30);
		};

		$scope.goto = function (state) {
			$state.go(state);
		}

		$scope.enterRoom = function(room_name){

			// me.current_room = room_name;
			localStorageService.set('room', me.rooms[room_name]);
			localStorageService.set('room-title', room_name);

			// var room = {
			// 	'room_name': room_name
			// };

			$state.go('room', {"roomid": me.rooms[room_name]});
		};

	}

})();
