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
    var date = new Date();

    if(data['message'] != null){
      $('span.mensagens').append('<p class="message"><span>'+data['player']+' ('+date.getHours().toString()+':'+date.getMinutes().toString()+'): </span>' + data['message'] + '</p>');
      $('span.mensagens').scrollTop( $(document).height());
    }

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

  $('.dice').click(function(){
        var dice = $(this).attr('id').match(/(\d+)/)[0];

        var result = Math.floor(Math.random() * parseInt(dice)) + 1;
        var bonus =  parseInt($('#bonusDice' + dice.toString()).val()) || 0;
        
          $('#bonusDice' + $('this').attr('id')).val('0');
          msg.send('(Rolled D' +dice.toString() + ')'+ result +' + ' + bonus  + ' = ' + (result + bonus));
    });
    
  msg.send('Entrou na sala.');
});
