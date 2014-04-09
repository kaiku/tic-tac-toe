var TicTacToe;

TicTacToe = function(element, player1, player2) {
  var X = Board.X,
      O = Board.O
      self = this;

  this.$element = $(element);
  this.board = null;
  this.currentPiece = X;
  this.players = {
    X: player1,
    O: player2
  };

  // Move is called on the element.
  this.$element.on('ttt.api.move', function(e) {
    self.move.call(self, e.move);
  });

  this.$element.on('ttt.api.reset', function() {
    self.reset.call(self);
  });

  this.reset();
};

TicTacToe.prototype.constructor = TicTacToe;

TicTacToe.prototype.reset = function() {
  this.board = new Board();
  this.currentPiece = Board.X;

  // Draw out the board.
  this.board.drawToConsole();

  // Announce that the board was reset, indicating the current piece.
  this.$element.trigger($.Event('ttt.on.reset', {piece: this.currentPiece}));

  // Initialize the players.
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

    // Announce that a move was made.
    this.$element.trigger($.Event('ttt.on.move', {
      board: this.board.toArray(),
      piece: this.currentPiece,
      point: point
    }));

    // Announce the appropriate events if we're in a terminal state.
    if (this.board.isGameOver()) {
      if (this.board.isWin(Board.X)) {
        this.$element.trigger($.Event('ttt.on.end', {state: 'win', winner: Board.X}));
      } else if (this.board.isWin(Board.O)) {
        this.$element.trigger($.Event('ttt.on.end', {state: 'win', winner: Board.O}));
      } else if (this.board.isDraw()) {
        this.$element.trigger($.Event('ttt.on.end', {state: 'draw'}));
      }
    } else {
      this.currentPiece = this.currentPiece === Board.X ? Board.O : Board.X;
      this.triggerCurrentPlayerMove();
    }
  } catch (e) {}
};

TicTacToe.prototype.getBoard = function() {
  return this.board;
};

$.fn.ttt = function(player1, player2) {
  return this.each(function() {
    var $this   = $(this),
        data    = $this.data('ttt');
        player1 = player1 || 'human',
        player2 = player2 || 'ai';

    player1 = player1 === 'human' ? new HumanPlayer() : new AIPlayer();
    player2 = player2 === 'human' ? new HumanPlayer() : new AIPlayer();

    $this.data('ttt', new TicTacToe(this, player1, player2));
  })
};

$.fn.ttt.Constructor = TicTacToe;

///////////////

var tttElement = $('#tic-tac-toe').ttt();

tttElement.find('.cell').on('click', function() {
  // Calculate which cell, 0-8, was clicked and trigger the move.
  var point = $(this).parent().index() * 3 + $(this).index();
  tttElement.trigger($.Event('ttt.api.move', {move: point}));
});

tttElement.on('ttt.on.move', function(e) {
  var board = e.board,
      piece = e.piece,
      point = e.point;

  console.log('ttt.on.move', JSON.stringify(board), piece, point);
});

tttElement.on('ttt.on.reset', function(e) {
  console.log('reset called');
});
