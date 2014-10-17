var express = require('express');
var app = express();
var games = {};

app.set('views', './views');
app.set('view engine', 'jade');
app.set('public', './public');
app.use(express.static(__dirname + '/public'));

//var port = process.env.PORT || 8080;
var io = require('socket.io').listen(app.listen(8080));

app.get('/', function(req, res){
  res.render('index');
});

app.get('/create/:name', function(req, res) {
  var newId = Math.round(Math.random() * 100000);

  games[newId] = {id: newId, members: []};
  res.redirect('/game/'+newId + "/" + req.params.name);
});

app.get('/game/:id/:name', function(req, res){
  game = games[req.params.id];

  if(game != null && game.members.length > 0 &&  game.members.indexOf(req.params.name.toLowerCase()) != -1)
    res.render("/index", {erro: "Nome de usuário já usado nesse jogo."});
  else{
    game.members.push(req.params.name.toLowerCase());
    res.render('chat');
  }
})


io.sockets.on('connection', function(socket){

	socket.on('add_player', function(data){
		socket.player = data.player;
		socket.room = games[data.id];
		socket.join(socket.room.id);
		socket.broadcast.to(socket.room.id).emit('add_player', data);
	});

	socket.on('mensagem', function(data) {
		socket.broadcast.to(socket.room.id).emit('client', data);
	});

	socket.on('map', function(data) {
		socket.broadcast.to(socket.room.id).emit('client', data);
	});
	
	socket.on('disconnect', function(){
		games[socket.room.id].members.splice(games[socket.room.id].members.indexOf(socket.player) ,1);
		socket.broadcast.to(socket.room.id).emit('player_disconnected', {id: socket.room.id, player: socket.player, message: "Saiu da sala" });
		socket.leave(socket.room.id_chat);
	});
});


