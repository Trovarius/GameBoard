var socketio = io.connect();



function Mensagem(){
  var url_parse =  window.location.href.match(/game\/(\d+)\/(\w+)/));
  this.id_chat = url_parse[1];
  this.player_name = url_parse[2];
  msg= this;

  this.send = function(msg){
   socketio.emit('mensagem', {id: this.id_chat, player: this.player_name, message: msg});
  };
  
  this.receive = function(data){
    if(data['id']== msg.id_chat)
      alert(data['message']);
  };
}

$(document).ready(function(){
 var msg = new Mensagem();

  socketio.on('client', msg.receive);


  $('#btnSend').click(function() {
    socketio.emit('mensagem', {id: id_chat , message: 'teste'});
  });
  
  msg.send('novo player entrou na sala.');

});
