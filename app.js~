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
    res.redirect("/index", {erro: "Nome de usuário já usado nesse jogo."});
  else{
    game.members.push(req.params.name.toLowerCase());
    res.render('chat');
  }
})


io.sockets.on('connection', function(socket){

 socket.on('mensagem', function(data) {
    io.sockets.emit('client', {id: data['id'], player: data['player'], message: data["message"]});
 });

 socket.on('map', function(data) {
    io.sockets.emit('client', {id: data['id'], player: data['player'], map: data["map"]});
 });

});


