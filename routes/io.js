
var io = require('socket.io')();

var players = [];

io.sockets.on('connection', function(socket){
    // Test comunicación
    socket.on('connection', function(socket){
        console.log('Hello Clients');
    });

    socket.on('NewPlayer', function(client){
        players.push(client);
        console.log("NUEVO JUGADOR. LISTA ACTUALIZADA");
        console.log(players);
    });

    socket.on("SomeOneMove", function(client){
        console.log(client[0] + " se ha movido");
        for(i=0; i<=players.length-1; i++){
            if(players[i].id == client[0]){
                players[i].x = client[1];
                players[i].y = client[2];
            }
        }
    });

    socket.on("Sync", function () {
        socket.emit("RefreshPlayerList", players);
    });

});

module.exports = io;