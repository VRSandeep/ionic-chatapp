(function(){
	angular.module('starter')
	.controller('HomeController', ['$scope', '$state', '$timeout', '$ionicPopup', '$ionicLoading', '$ionicHistory', 'localStorageService', 'AuthService', HomeController]);

	function HomeController($scope, $state, $timeout,$ionicPopup, $ionicLoading, $ionicHistory, localStorageService, AuthService){

		var me = this;
		me.current_room = localStorageService.get('room');
		me.rooms = ['Public', 'Room 1', 'Room 2'];

		if (AuthService.isAuthenticated()) {
			$state.go('rooms');
		}
		me.show_login_form = true;

		$scope.login = function(username, password){
			AuthService.loginUser(username, password).then(function(data) {
	            console.log(data);
	            $state.go('rooms');
	        }, function(error) {
	        	console.error(error);
	            $ionicPopup.alert({
	                title: 'Login failed!',
	                template: 'Please check your credentials!'
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

			me.current_room = room_name;
			localStorageService.set('room', room_name);

			var room = {
				'room_name': room_name
			};

			// SocketService.emit('join:room', room);

			$state.go('room');
		};

	}

})();
