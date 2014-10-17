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
		   this.players = {};
		   this.objects = [];
		   this.monsters = [];
           this.mouseDown = false;
		   this.Ferramenta = null;
		   this.ObjSelecionado = null;

           board = this;
           this.SQUARE_NUMBER = 15;
           this.BLOCK_SIZE = $canvas.width() / this.SQUARE_NUMBER;

		   
		   $canvas.find('[board-object-move="true"]').click(function(){
		     alert('esse objeto vai se mover');
		   });

			function makeSVG(tag, attrs) {
            	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
            	for (var k in attrs)
                	el.setAttribute(k, attrs[k]);
            	return el;
        	}

			function makeMovedObject(x, y, title, background){
				background = background || "white";

				var g = makeSVG('g', {transform: 'translate('+ x +','+ y +')', 'board-moved-object': 'true'});
				var circle = makeSVG('circle', {r: '23', stroke: background, fill: background});
				var text = makeSVG('text', {dx: -10});
				text.innerHTML = title;
				
				g.appendChild(circle);
				g.appendChild(text);
				$canvas.append($(g));
				
				$(g).css('cursor', 'move');
				$(g).mousedown(function(){
					board.Ferramenta = Board.TipoFerramenta.Player;
					board.ObjSelecionado = $(this);
				})
				.mouseup(function(){
					board.ObjSelecionado = null;
				});
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
					$(board.ObjSelecionado).attr('transform', 'translate('+ position.x +', '+ position.y +')');
					$(board.ObjSelecionado).toFront();
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

		   this.AddPlayer = function(playerName){
			   this.players[playerName.toString()] = {color:"blue", x: 30, y: 30};
                this.DrawPlayer();
		   }

		   this.RemovePlayer = function(playerName){
		   		var index = this.Player.indexOf(playerName);
				this.players.splice(index, 1);
				this.DrawPlayer();
		   }

		   this.DrawPlayer = function(){
		   		for(var index in this.players){
					var player = this.players[index];
					makeMovedObject(player.x, player.y, index, player.color);
				}
		   }

           this.UpdateMap = function(squares, players, objects){
              this.squares = squares;
			  this.players = players;
			  this.objects = objects;
              this.DrawBoard();
			  this.DrawPlayer();
           }
       }
