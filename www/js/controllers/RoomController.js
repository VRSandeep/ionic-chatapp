(function(){
	angular.module('starter')
	.controller('RoomController', RoomController);

	function RoomController($scope, $state, $ionicScrollDelegate, $ionicPopup, $http, localStorageService, SocketService, moment){

		var me = this;

		me.messages = [];
		$scope.username = 'anonymous';

		me.current_room = localStorageService.get('room');
		// $scope.Messages = SocketService;

		$scope.submit = function() {
			SocketService.project(me.current_room).send({
				username: $scope.username,
				message: me.message
			});
			// $scope.new_message = '';
		};
		$scope.getHistory = function(room) {
			// Fetch messages from server and populate me.messages
			// me.messages.push()
			$http.get('http://localhost:8000/room/' + room + '/').then(function(response){
				// console.log(response.data);
				me.messages = response.data.reverse();
				$ionicScrollDelegate.scrollBottom();
				console.log(me.messages);
			}, function(error){
				console.error(error);
				$ionicPopup.alert({
	                title: 'Network Error',
	                template: 'Failed to fetch room chat! Please check your internet connection!'
	            });
			});
		};
		$scope.getHistory(me.current_room);

		var current_user = localStorageService.get('username');

		$scope.isNotCurrentUser = function(user){

			if(current_user != user){
				return 'not-current-user';
			}
			return 'current-user';
		};


		// $scope.sendTextMessage = function(){

		// 	var msg = {
		// 		'room': me.current_room,
		// 		'user': current_user,
		// 		'text': me.message,
		// 		'time': moment()
		// 	};


		// 	me.messages.push(msg);
		// 	$ionicScrollDelegate.scrollBottom();

		// 	me.message = '';

		// 	SocketService.emit('send:message', msg);
		// };


		// $scope.leaveRoom = function(){

		// 	var msg = {
		// 		'user': current_user,
		// 		'room': me.current_room,
		// 		'time': moment()
		// 	};

		// 	SocketService.emit('leave:room', msg);
		// 	$state.go('rooms');

		// };


		// SocketService.on('message', function(msg){
		// 	me.messages.push(msg);
		// 	$ionicScrollDelegate.scrollBottom();
		// });


	}

})();
