var app = require('express')();
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);
var ws;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Front 연결을 기다린다!!!
server.listen(3000, function() {
  console.log('Socket IO server listening on port 3000');
});

// Front와 연결되면?!
io.on('connect', function(socket) {
    // Device와 연결 시도한다.
    initWS(socket);

    // Front 에서 메시지를 받으면
    socket.on('message', function(data) {
        // Device 로 메시지를 전달한다.
        ws.send(data);
    });
});

function initWS(socket) {
    // Device 와 연결한다.
    const WebSocket = require('ws');
    ws = new WebSocket("ws://localhost:8886");
    ws.binaryType = 'arraybuffer';
    
    ws.onopen = function(event) {
        console.log("Connect to device via WebSocket");
    }

    // Device 에서 메시지를 받으면
    ws.onmessage = (e) => {
        // Front 로 메시지를 전달한다.
        if ( socket != null ) {
            socket.emit('message', e.data);
        }
    }

    // error event handler
    ws.onerror = function(event) {
        console.log("Server error message: ", event.data);
    }
}


