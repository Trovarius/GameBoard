var socketio = io.connect();

function Mensagem(){
  var url_parse =  window.location.href.match(/game\/(\d+)\/(\w+)/);
  this.id_chat = url_parse[1];
  this.player_name = url_parse[2];
  msg= this;

  this.send = function(msg){
   socketio.emit('mensagem', {id: this.id_chat, player: this.player_name, message: msg});
  };

  this.sendMap = function(squares) {
    socketio.emit('map', {id: this.id_chat, player:this.player_name, map: squares});
  }
  
  this.receive = function(data){
    if(data['id']== msg.id_chat){
      console.log(data);
      $('span.mensagens').append('<p>' + data['message'] + '</p>')
    }
  };
}

$(document).ready(function(){
  var msg = new Mensagem();
  var b = new Board(document.getElementById('board'));

  socketio.on('client', function(data){
    if(data['id'] != msg.id_chat) return;

    if(data['message'] != null)
      $('span.mensagens').append('<p>' + data['message'] + '</p>');

    if(data['map'] != null)
      b.UpdateMap(data['map']);
  });


  $('#btnSend').click(function() {
    if($('#txtMensagem').val() != "") {
      msg.send($('#txtMensagem').val());
    }
  });

  $('#btnMapSend').click(function(){
    msg.sendMap(b.squares);
  });
  
  
  b.InitializeSquares();
  b.DrawBoard();



  $('button.button.dice').click(function(){
        var dice = $(this).attr('id').match(/(\d+)/)[0];

        var result = roll(parseInt(dice));
        var bonus =  parseInt($('#txtBonus' + $(this).attr('id')).val().match(/(\d+)/) || 0);
        
          $('#txtBonus' + $('this').attr('id')).val('0');
          showMesage(result +' + ' + bonus  + ' = ' + (result + bonus));
    });

});
