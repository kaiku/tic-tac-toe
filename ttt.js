var TicTacToe;

TicTacToe = function(player1, player2) {
  this.board     = null;
  this.ended     = false;
  this.whoseTurn = 0;
  this.players   = [player1, player2];

  this.reset();
  this.start();
};

TicTacToe.prototype.constructor = TicTacToe;

TicTacToe.prototype.reset = function() {
  this.board = new Board();

  // Draw out the board.
  this.board.drawToConsole();
};

TicTacToe.prototype.start = function() {
  this.players[0].setBoard(this.board);
  this.players[0].setPiece('X');
  this.players[1].setBoard(this.board);
  this.players[1].setPiece('O');

  // Tell the first player to move.
  this.triggerMove();
};

TicTacToe.prototype.triggerMove = function() {
  var self = this;

  if (this.ended) {
    return;
  }

  this.acceptMove(this.players[this.whoseTurn].move());
};

TicTacToe.prototype.acceptMove = function(move) {
  var currentPlayer = this.players[this.whoseTurn];

  try {
    // Move the piece for the given player.
    this.board.move(currentPlayer.piece, move);

    // Redraw
    this.board.drawToConsole();

    // Update the current player's board.
    currentPlayer.setBoard(this.board);

    // Flip the turn.
    this.whoseTurn = Number(!this.whoseTurn);

    if (!this.board.getAvailableMoves().length || currentPlayer.hasWon()) {
      console.log('Game is over; setting this.ended = true');
      this.ended = true;
    }
  } catch(e) {
    console.log('Error', e);
  }
};

////////////////

//var ttt = new TicTacToe(new AIPlayer(), new AIPlayer());

var cells = document.getElementsByClassName('cell');

for (var i = 0; i < cells.length; i++) {
  cells[i].addEventListener('click', (function(i) {
    return function() {
      var coords = JSON.parse(cells[i].getAttribute('data-coord'));
      //ttt.triggerMove();
    };
  })(i), false); 
}
