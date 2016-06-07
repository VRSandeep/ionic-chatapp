(function(){

	angular.module('starter')
	.factory('SocketService', SocketService);

	function SocketService($websocket, $q){
		// return socketFactory({
		// 	ioSocket: io.connect('http://localhost:8000')
		// });
        // Open a WebSocket connection

        // return methods;
        // var ws = $websocket('ws://localhost:8000/chat/public/');
        var ws;
        var collection = [];

        // ws.onMessage(function(event) {
        //     console.log('message: ', event);
        //     var res;
        //     try {
        //         res = JSON.parse(event.data);
        //     } catch(e) {
        //         res = {'username': 'anonymous', 'message': event.data};
        //     }

        //     collection.push({
        //         username: res.username,
        //         content: res.message,
        //         timeStamp: event.timeStamp
        //     });
        // });

        // ws.onError(function(event) {
        //     console.log('connection Error', event);
        // });

        // ws.onClose(function(event) {
        //     console.log('connection closed', event);
        // });

        // ws.onOpen(function() {
        //     console.log('connection open');
        //     ws.send({'user': 1});
        // });
        // setTimeout(function() {
        //   ws.close();
        // }, 500)
        var roomConn;
        return {
            collection: collection,
            status: function() {
                return ws.readyState;
            },
            send: function(message) {
                if (angular.isString(message)) {
                    ws.send(message);
                }
                else if (angular.isObject(message)) {
                    ws.send(JSON.stringify(message));
                }
            },
            project: function (room) {
                var deferred = $q.defer();

                // If the requested room is fetched already, just resolve
                if (!room || (roomConn && roomConn.room === room)) {
                    console.log('get from cache');
                    deferred.resolve(roomConn);
                } else {
                    // console.log('sending request...');
                    // $http.get('http://jsonplaceholder.typicode.com/posts/' + room).success(function (response) {
                    //     roomConn = response;
                    //     deferred.resolve(roomConn);
                    // }).error(function (response) {
                    //     deferred.reject(response);
                    // });
                    ws = $websocket('ws://localhost:8000/chat/' + room + '/');
                    roomConn = ws;
                    collection = [];

                    ws.onMessage(function(event) {
                        console.log('message: ', event);
                        var res;
                        try {
                            res = JSON.parse(event.data);
                        } catch(e) {
                            res = {'username': 'anonymous', 'message': event.data};
                        }

                        collection.push({
                            username: res.username,
                            content: res.message,
                            timeStamp: event.timeStamp
                        });
                    });

                    ws.onError(function(event) {
                        console.log('connection Error', event);
                    });

                    ws.onClose(function(event) {
                        console.log('connection closed', event);
                    });

                    ws.onOpen(function() {
                        console.log('connection open');
                        ws.send({'user': 1});
                    });
                    deferred.resolve(roomConn);
                }
                return deferred.promise;
            }

        };
	}
})();

