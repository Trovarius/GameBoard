var socketio = io.connect();


function Mensagem(){
  var url_parse =  window.location.href.match(/game\/(\d+)\/(\w+)/);
  this.id_chat = url_parse[1];
  this.player_name = url_parse[2];
  msg= this;
  
  this.addPlayer = function(){
  	socketio.emit('add_player', {id: this.id_chat, player: this.player_name, message: "Entrou na sala"});
  }

  this.send = function(msg){
   socketio.emit('mensagem', {id: this.id_chat, player: this.player_name, message: msg});
  };

  this.sendMap = function(squares) {
    socketio.emit('map', {id: this.id_chat, player:this.player_name, map: squares});
  }

  this.sendRoll = function(dice, bonus){
    var result = Math.floor(Math.random() * parseInt(dice)) + 1;
    var mensagem = '(Rolled D' +dice.toString() + ') '+ result +' + ' + bonus  + ' = ' + (result + bonus);
            console.log(mensagem);
    socketio.emit('mensagem', {id: this.id_chat, player:this.player_name, dice: mensagem })
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
    var mensagem = $('<p class="message"><span class="player">'+data['player']+' ('+date.getHours().toString()+':'+date.getMinutes().toString()+'): </span></p>');
    console.log(data);

    if(data['message'] != null){
      mensagem.append(data['message']);
    } else if (data['dice'] != null){
        console.log(data['dice']);
       mensagem.append('<span class="diceRolled">'+data['dice']+'</span>');
    } else if(data['map'] != null){
      b.UpdateMap(data['map']);
      mensagem.text('Mapa atualizado');
    }
    
    $('span.mensagens').append(mensagem);
    $('span.mensagens').scrollTop( $(document).height());
  });

  socketio.on('add_player', function(data){
	    console.log(data);
  		b.AddPlayer(data.player);
		msg.send('Entrou na sala');
  });

  socketio.on('player_disconnected', function(){
  		b.RemovePlayer(data.player);
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
        var bonus =  parseInt($('#bonusDice' + dice.toString()).val()) || 0;
        $('#bonusDice' + $('this').attr('id')).val('0');
        msg.sendRoll(dice, bonus);
    });
    
  msg.addPlayer();
  
  $('#txtColorGround').change(function(){
  		b.Ferramenta = Board.TipoFerramenta.Terreno;
  });

  $('button#player1').click(function(){
	  console.log('a');
  		b.Ferramenta = Board.TipoFerramenta.Player;
  })
});
