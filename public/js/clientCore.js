$(document).ready(function() {


    var socket = io();
    // Test comunicación
    socket.on('connect', function(){
        console.log('Hello Server');
    });
    //CANVAS GAME
    var canvas = CE.defines("canvas").
        extend(Animation).
        extend(Input).
        extend(Hit).
        extend("../js/players.js").
        ready(function() {
            canvas.Scene.call("MyScene",{
            });

        });

    //DEFINICION DEL JUEGO
    canvas.Scene.New({

        //Nombre
        name: "MyScene", // Obligatory

        //Texturas
        materials: {
            images: {
                background: "/images/background.jpg",    //Stage
                ch1back:  "/images/ch1back.png",         //pj1 back
                ch1right: "/images/ch1right.png",        //pj1 right
                ch1left: "/images/ch1left.png",          //pj1 left
                ch2back:  "/images/ch2back.png",         //pj2 back
                ch2right: "/images/ch2right.png",        //pj2 right
                ch2left: "/images/ch2left.png",          //pj2 left
                coche: "../images/coche.png"
            }
        },


        //METODOS
        ready: function(stage, params) {            //PREPARA LA INTERFAZ

            //STAGE
            this.dimensions = this.getCanvas();

            //escenario
            this.background = this.createElement();
            this.background.drawImage("background");
            stage.append(this.background);


            //NUEVO JUGADOR
            this.localPlayer = this.createElement();
            localP = this.localPlayer;
            localP.id = socket.id;
            localP.x = Math.floor((Math.random() * 900));
            localP.y = this.dimensions.height - 115;
            localP.drawImage("ch1back");
            stage.append(this.localPlayer);
            console.log("MI JUGADOR");
            console.log("Id :" + localP.id);
            console.log("Mi x :" +  localP.x);
            console.log("Mi y :" +  localP.y);

            //LISTA DE JUGADORES
            this.remotePlayers = [];
            remotePlayers = this.remotePlayers;

            //EVENTOS DEL SOCKET//
            socket.emit('NewPlayer', {id: socket.id,  x:  this.localPlayer.x, y:  this.localPlayer.y});  //NOTIFICA AL SERVER DE QUE ENTRAS EN EL JUEGO

            socket.on("RefreshPlayerList", function(players){        //RECIBE LISTA DEL SERVER
                remotePlayers =  [];
                remotePlayers.push(players);        //La sincroniza con la local
                console.log('JUGADORES REMOTOS');
                console.log(remotePlayers);
            });

            //MOVIMIENTOS
            canvas.Input.keyDown(Input.Left, function() {
                localP.x -= 3;
                socket.emit("SomeOneMove", [localP.id, localP.x, localP.y])

            });
            canvas.Input.keyDown(Input.Right, function() {
                localPlayer.x += 3;
                CE.io.emit('Moving', {id: localPlayer.id, x: localPlayer.x, y :localPlayer.y});
            });
            canvas.Input.keyDown(Input.Up, function() {
                localPlayer.y -= 2;
                CE.io.emit('Moving', {id: localPlayer.id, x: localPlayer.x, y :localPlayer.y});
            });
            canvas.Input.keyDown(Input.Bottom, function() {
                localPlayer.y += 2;
                CE.io.emit('Moving', {id: localPlayer.id, x: localPlayer.x, y :localPlayer.y});
            });

            /*this.player.drawImage("ch1back");
             stage.append(this.player);
             this.pj2 = this.createElement();
             this.pj2.drawImage("ch2back");
             this.pj2.x = dimensions.width /2 - 256;
             this.pj2.y= dimensions.height - 115;
             stage.append(this.pj2);

             var movepj1 = canvas.Animation.new({
             images: "character1",
             animations: {
             walk: {
             frames: [0, 20],
             size: {
             width: 576/9,
             height: 256/4
             },
             frequence: 15
             }
             }
             });

             var al = this.createElement();
             al.fillCircle(50, 100, 30, 30);
             stage.append(al);



             function addEntities(x, y) {
             var entity = Class.New("Entity", [stage]);
             entity.rect(50); // square
             entity.position(x, y);
             entity.el.strokeRect(0, 0, 50, 50);
             stage.append(entity.el);
             return entity;
             }

             this.entityA = addEntities(0, 10);
             this.entityB = addEntities(300, 10);


             //crear y añadir elementos
             /*    this.coche = this.createElement(); //Crear un elemento
             this.coche.drawImage("coche");    //Dibujar una imagen en el elemento
             stage.append(this.coche); //añade el elemento al stage

             /*text = this.createElement();
             var el = this.createElement(50 , 50);

             el.strokeRect(0, 0, 50, 50);
             el.fillStyle = "red";
             el.fillRect(300, 200, 100, 100);

             el.on("mouseover", function(e) {
             text.fillText("Over", 300, 200);
             });
             el.on("mouseout", function(e) {
             text.fillText("Out", 300, 200);
             });

             text.fillStyle = "black";
             text.font = "15px Arial";
             text.fillText("Place your mouse", 300, 200);
             text.x = 120;
             text.y = 50;

             stage.append(el, text);
             //EVENTO PRUEBA
             var prueba = this.createElement(200,200);
             prueba.drawImage('coche');
             stage.append(prueba);
             prueba.on("mouseover", function(e) {
             console.log('coche');
             var mensaje = "entrando en el entityA";
             CE.io.emit('entrar', mensaje);
             });

             */

        },

        render: function(stage) {

            /* for(i=0; i<=players.length -1 ;i++){

             var oneRemotePlayer =  players[i][0];

             oneRemotePlayer   = stage.createElement();

             oneRemotePlayer.id = players[i][0];
             oneRemotePlayer.x = players[i][1];
             oneRemotePlayer.y = players[i][2];

             }
            this.entityA.move(1); // x += 1;
             this.entityA.hit([this.entityB], function(state, el) {
             if (state == "over") {
             el.opacity = 0.2;
             el.fillStyle = "green";
             el.fillRect(0, 0, 50, 50);
             }
             if (state == "out") {
             el.fillStyle = "blue";
             el.fillRect(0, 0, 50, 50);
             }
             });
             //mover en los ejes un elementos
             /* this.coche.y += 0.1;

             this.coche.x += 0.2;
            if(this.player.x == 180){
             this.player.drawImage('ch1right');
             }*/
            stage.refresh();

        },

        exit: function(stage) {

        }
    });
});