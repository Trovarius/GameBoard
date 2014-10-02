       function Board(obj){
           var canvas = obj,
           $canvas = $(obj);
           this.ctx = canvas.getContext('2d');
           this.squares = [];
           this.mouseDown = false;

           board = this;
           this.SQUARE_NUMBER = 20;
           this.BLOCK_SIZE = canvas.width / this.SQUARE_NUMBER;

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

           $canvas.mousemove(function(evt){
               //var position = getCursorPosition(evt);
               var position = {x: evt.pageX - canvas.offsetLeft,
                               y: evt.pageY - canvas.offsetTop};

               var square = board.GetElementByPosition(position);
              
               if(board.mouseDown){
               square.background = $('#txtColorGround').val();
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
               for(var row = 0; row < this.SQUARE_NUMBER; row++){
                   for(var column = 0; column < this.SQUARE_NUMBER; column++){
                       this.squares.push({x: row, 
                                          y: column, 
                                          top: row * board.BLOCK_SIZE, 
                                          left: column * board.BLOCK_SIZE,
                                          size: this.BLOCK_SIZE,
                                          background: 'white',
                                          objects: []
                                          });
                   }
               }
           }

           this.DrawBoard = function(){
               this.ctx.clearRect(0,0, canvas.width, canvas.height);

               for(var index in this.squares){
                    square = this.squares[index];
                    this.ctx.beginPath();
                    this.ctx.rect(square.left, square.top, square.size, square.size);
                    this.ctx.lineWidth = '0.5';
                    this.ctx.strokeStyle = 'black';
                    this.ctx.fillStyle = square.background;
                    this.ctx.fill();
                    this.ctx.stroke();
              }
           }

           this.UpdateMap = function(squares){
              this.squares = squares;
              this.DrawBoard();
           }
       }

          function roll(max){
             return Math.floor(Math.random() * max) + 1
          } 
