var TicTacToe;

TicTacToe = function(player1, player2) {
  this.board     = null;
  this.started   = null;
  this.whoseTurn = null;
  this.players   = [player1, player2];

  this.reset();
  this.start();
};

TicTacToe.prototype.constructor = TicTacToe;

TicTacToe.prototype.reset = function() {
  this.board     = new Board();
  this.started   = false;
  this.whoseTurn = 0;

  // Draw out the board.
  this.board.drawToConsole();
};

TicTacToe.prototype.start = function() {
  this.started = true;
  this.players[0].setBoard(this.board);
  this.players[0].setPiece('X');
  this.players[1].setBoard(this.board);
  this.players[1].setPiece('O');

  // Tell the first player to move.
  this.triggerMove();
};

TicTacToe.prototype.triggerMove = function() {
  var self = this;

  this.acceptMove(this.players[this.whoseTurn].move());

  // setTimeout(function() {
  //   self.triggerMove();
  // }, 500);
};

TicTacToe.prototype.acceptMove = function(move) {
  var currentPlayer = this.players[this.whoseTurn];

  try {
    // Move the piece for the given player.
    this.board.move(currentPlayer.piece, move);

    // Flip the turn.
    this.whoseTurn = Number(!this.whoseTurn);

    // Redraw
    this.board.drawToConsole();
  } catch(e) {}
};

////////////////

var ttt = new TicTacToe(new AIPlayer(), new AIPlayer());



var cells = document.getElementsByClassName('cell');

for (var i = 0; i < cells.length; i++) {
  cells[i].addEventListener('click', (function(i) {
    return function() {
      var coords = JSON.parse(cells[i].getAttribute('data-coord'));
      ttt.triggerMove();
      //ttt.move('X', coords[0], coords[1]);
    };
  })(i), false); 
}
