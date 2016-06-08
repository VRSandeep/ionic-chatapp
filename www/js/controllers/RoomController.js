(function(){
	angular.module('starter')
	.controller('RoomController', RoomController);

	function RoomController($scope, $state, $ionicScrollDelegate, $ionicPopup, $http, $websocket, localStorageService, moment){

		var me = this;

		me.messages = [];

		me.current_room = localStorageService.get('room');

		if (!me.current_room) {
			$state.go('rooms');
		}

		$scope.getHistory = function(room) {
			// Fetch messages from server and populate chat
			$http.get('http://localhost:8000/room/' + room + '/').then(function(response){
				me.messages = response.data.reverse();
				$ionicScrollDelegate.scrollBottom();
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

		var ws = $websocket('ws://localhost:8000/chat/' + me.current_room + '/');

		ws.onOpen(function() {
		    console.log('connection open');
		});

		$scope.submit = function() {

			$ionicScrollDelegate.scrollBottom();
			ws.send({
				"user": current_user,
				"content": me.message
			});
			me.message = "";
		};

		ws.onMessage(function(event) {
		    console.log('message: ', event);
		    var res;
		    try {
		        res = JSON.parse(event.data);
		    } catch(e) {
		        res = {'username': 'anonymous', 'message': event.data};
		    }

		    me.messages.push({
		        "user": res.user,
		        "content": res.content,
		        "created": event.created
		    });
		    $ionicScrollDelegate.scrollBottom();
		});

		$scope.leaveRoom = function(){

			var msg = {
				"user": current_user,
				"room": me.current_room,
				// "time": moment()
			};
			ws.close();
			$state.go('rooms');
		};

		ws.onError(function(event) {
		  	console.log('connection Error', event);
		});

		ws.onClose(function(event) {
		  	console.log('connection closed', event);
		});

	}

})();
