var TicTacToe;

TicTacToe = function(element, player1, player2) {
  var X = Board.X,
      O = Board.O;

  this.$element = $(element);
  this.board = null;
  this.currentPiece = X;
  this.players = {
    X: player1,
    O: player2
  };

  this.bindEvents();
  this.reset();
  this.start();
};

TicTacToe.prototype.constructor = TicTacToe;

TicTacToe.prototype.bindEvents = function() {
  var self = this;

  this.$element.on('ttt.move', function(e) {
    self.move.call(self, e.move);
  });
};

TicTacToe.prototype.reset = function() {
  this.board = new Board();

  // Draw out the board.
  this.board.drawToConsole();
};

TicTacToe.prototype.start = function() {
  for (var piece in this.players) {
    this.players[piece].setPiece(piece);
    this.players[piece].setManager(this);
  }

  // Tell the first player to move.
  this.triggerCurrentPlayerMove();
};

TicTacToe.prototype.triggerCurrentPlayerMove = function() {
  this.players[this.currentPiece].move();
};

/**
 * Players will notify the manager that they've moved via this method.
 */
TicTacToe.prototype.move = function(point) {
  var self = this;

  if (this.board.isGameOver()) {
    return;
  }

  try { 
    this.board.move(this.currentPiece, point);
    this.board.drawToConsole();

    if (this.board.isGameOver()) {
      if (this.board.isWin(Board.X)) {
        console.log('Winner: ' + Board.X);
      } else if (this.board.isWin(Board.O)) {
        console.log('Winner: ' + Board.O);
      } else if (this.board.isDraw()) {
        this.state = 'draw';
        console.log('Draw!');
      }
    } else {
      this.currentPiece = this.currentPiece === Board.X ? Board.O : Board.X;
      this.triggerCurrentPlayerMove();
    }
  } catch (e) {}
};

////////////////

$.fn.ttt = function(player1, player2) {
  return this.each(function() {
    var $this   = $(this),
        data    = $this.data('tictactoe');
        player1 = player1 || 'human',
        player2 = player2 || 'ai';

    player1 = player1 === 'human' ? new HumanPlayer() : new AIPlayer();
    player2 = player2 === 'human' ? new HumanPlayer() : new AIPlayer();

    $this.data('tictactoe', new TicTacToe(this, player1, player2));
  })
};

$.fn.ttt.Constructor = TicTacToe;

///////////////

var tttElement = $('#tic-tac-toe').ttt('ai', 'human');

tttElement.find('.cell').on('click', function() {
  // Calculate which cell, 0-8, was clicked.
  var point = $(this).parent().index() * 3 + $(this).index();

  tttElement.trigger($.Event('ttt.move', {move: point}));
});
