       function Board(obj){
		   Board.TipoFerramenta = {
		   		"Selecionado" : "1",
				"Terreno"     : "2",
				"Objeto" 	  : "3",
				"Player" 	  : "4"
		   }

           var canvas = obj,
           $canvas = $(obj);
           this.squares = [];
		   this.players = [];
		   this.objects = [];
           this.mouseDown = false;
		   this.Ferramenta = null;
		   this.ObjSelecionado = null;

           board = this;
           this.SQUARE_NUMBER = 20;
           this.BLOCK_SIZE = $canvas.width() / this.SQUARE_NUMBER;
		   
			function makeSVG(tag, attrs) {
            	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
            	for (var k in attrs)
                	el.setAttribute(k, attrs[k]);
            	return el;
        	}

			function makeFloor(obj){
				$(obj).bind('mouseover click', function(){
					if(this.Ferramenta != null && this.Ferramenta == Board.TipoFerramenta.Terreno && this.mouseDown){
						$(this).attr('fill', $('#txtColorGround').val());
						board.squares[$(this).attr('board-square-index')].background = $('#txtColorGround').val();
					}
				});
			}

           function getCursorPosition(event){
               var point = {x: -1, y: -1};

               if(event.pageX != undefined && event.pageY != undefined){
                   point.x = event.pageX - canvas.offsetLeft;
                   point.y = event.pageY - canvas.offsetTop;
               }else{
                   point.x = event.clientX - canvas.offsetLeft;
                   point.y = event.clientY - canvas.offsetTop;
               }

               return point;
           }

		   this.DesenharSquare = function(square, position, rightButton){
			    if(this.Ferramenta == null || this.Ferramenta == undefined || this.Ferramenta == Board.TipoFerramenta.Selecionado){
					
				}			    

				if(this.Ferramenta == Board.TipoFerramenta.Objeto)
					square.borderColor = 'green';

				if(this.Ferramenta == Board.TipoFerramenta.Terreno){
                  	square.background = rightButton ? '#ffffff' : $('#txtColorGround').val();
					square.borderColor = 'black';
				}

				if(this.Ferramenta == Board.TipoFerramenta.Player){
					var imagePlayer = new Image();
					imagePlayer.src="/images/player.png";

					this.players.push({ point: position });
					this.DrawPlayer();
				}
		   }

           $canvas.bind('mouseover click', function(evt){
               //var position = getCursorPosition(evt);
               var position = {x: evt.pageX - canvas.offsetLeft,
                               y: evt.pageY - canvas.offsetTop};

               var square = board.GetElementByPosition(position);
              
               if(board.mouseDown || evt.type == 'click'){
					board.DesenharSquare(square, position, evt.button == '2');
                    board.DrawBoard();
               }
           }).mousedown(function(){
				board.mouseDown = true;               
           }).mouseup(function(){
				board.mouseDown = false; 
           });

           this.GetElementByPosition = function(position){
              for(var index in board.squares){
                     square = board.squares[index];
                     if(position.y > square.top && position.y < square.top + square.size &&
                             position.x > square.left && position.x < square.left + square.size)
                     {
                        return square;
                        break;
                     }
               }
           }

           this.InitializeSquares = function(){
			   this.squares = [];

               for(var row = 0; row < this.SQUARE_NUMBER; row++){
                   for(var column = 0; column < this.SQUARE_NUMBER; column++){
                       this.squares.push({x: row, 
                                          y: column, 
                                          top: row * board.BLOCK_SIZE, 
                                          left: column * board.BLOCK_SIZE,
                                          size: this.BLOCK_SIZE,
                                          background: 'white',
						                  borderColor: 'black'
                                          });
                   }
               }
           }

           this.DrawBoard = function(){
			   $canvas.find('rect').remove();
               for(var index in this.squares){
				   var square = this.squares[index];

				    var floor =  makeSVG('rect', {x:square.left,
					   							y:square.top, 
												width:square.size, 
												height:square.size, 
												fill:square.background, 
												stroke:square.borderColor, 
												'stroke-width': 2,
				   								'board-square-index': index});

					$canvas.append(floor);
              }
           }

		   this.DrawPlayer = function(){
		   		for(var index in this.players){
					var player = this.players[index];
					if(player.point == null) continue;

					//player.Image.onload = function(){
					//	board.ctx.drawImage(player.Image, player.point.x, player.point.y, board.BLOCK_SIZE, board.BLOCK_SIZE);
				//	}
					this.ctx.beginPath();
					this.ctx.arc(player.point.x, player.point.y, board.BLOCK_SIZE / 2.5, 0, 2 * Math.PI);
					this.ctx.fillStyle = 'green';
					this.ctx.fill();
					this.ctx.lineWidth = 3;
					this.ctx.strokeStyle = '#003300';
					this.ctx.stroke();
				}
		   }

           this.UpdateMap = function(squares){
              this.squares = squares;
              this.DrawBoard();
           }
       }
