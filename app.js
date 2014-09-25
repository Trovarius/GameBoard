var express = require('express');
var app = express();


app.set('views', './views');
app.set('view engine', 'jade');
app.set('public', './public');
app.use(express.static(__dirname + '/public'));

//var port = process.env.PORT || 8080;
var io = require('socket.io').listen(app.listen(8080));

app.get('/', function(req, res){
  res.render('index');
});

app.get('/chat', function(req, res) {
  var newId = Math.round(Math.random() * 100000);
  res.redirect('/chat/'+newId);
});

app.get('/chat/:id', function(req, res){
  res.render('chat');
})


io.sockets.on('connection', function(socket){

 socket.on('mensagem', function(data) {
    io.sockets.emit('client', {id: data['id'], message: data["message"]});
 });

});


