var socketio = io.connect();
var id_chat = window.location.href.match(/(\d+)/)[0];

socketio.on('client', function(data) {
  console.log(data);
  if(data['id'] == id_chat)
    alert(data['message']);
});

$(document).ready(function(){

  $('#btnSend').click(function() {
    socketio.emit('mensagem', {id: id_chat , message: 'teste'});
  });
  
  socketio.emit('mensagem', {id: id_chat, mensage: 'Novo player entrou na sala.'})

});
