var Board, Player, TicTacToe;

Board = function(board) {
  this.board = board || Board.DEFAULTS.board;
};

Board.DEFAULTS = {
  board: [null, null, null, null, null, null, null, null, null]
};

Board.prototype.constructor = Board;

/**
 * @param {Array}
 */
Board.prototype.reset = function() {
  this.board = Board.DEFAULTS.board;
};

/**
 * @return {Array} Array of indexes of available moves (0-8).
 */
Board.prototype.getAvailableMoves = function() {
  var indexes = [];
  for (var i in this.board) {
    if (this.board[i] === null) indexes.push(i);
  }
  return indexes;
};

Board.prototype.isValidMove = function(point) {
  // Move is valid if no move has been made in that box yet.
  return this.board[point] === null;
};

Board.prototype.move = function(piece, point) {
  if (!this.isValidMove(point)) {
    throw 'Invalid move';
  }

  this.board[point] = piece;
};

Board.prototype.getBoard = function() {
  return this.board;
};

/**
 * Renders the tic-tac-toe board in the console.
 */
Board.prototype.drawToConsole = function() {
  var output = [], row;

  output.push('   +-----------+ ');

  for (var i = 0; i < 3; i++) {
    row = this.board.slice(i * 3, i * 3 + 3).map(function(val) {
      return val === null ? ' ' : val;
    });

    output.push(' ' + i + ' | ' + row.join(' | ') + ' | ');
  }

  output.push('   +-----------+ ');

  for (var k in output) {
    console.log(output[k]);
  }
};

/**
 * TicTacToe
 */
TicTacToe = function(options) {
  this.options = options;
  this.board = new Board();
  this.started = false;
  this.whoseTurn = 0;
  this.players = [];

  this.start();
};

TicTacToe.prototype.constructor = TicTacToe;

TicTacToe.prototype.start = function() {
  this.started = true;
  this.board.drawToConsole();
};

TicTacToe.prototype.move = function(type, x, y) {
  var point = type === 'X' ? new XPoint(x, y) : new OPoint(x, y);

  try {
    this.board.move(point);
    this.board.drawToConsole();
  } catch (e) {}
};

TicTacToe.prototype.reset = function() {
  // TODO: pull these from defaults
  this.started = false;
  this.whoseTurn = 0;

  // Redraw the board
  this.board.init();
  this.board.drawToConsole();
};


////////////////

var ttt = new TicTacToe();

var cells = document.getElementsByClassName('cell');

for (var i = 0; i < cells.length; i++) {
  cells[i].addEventListener('click', (function(i) {
    return function() {
      var coords = JSON.parse(cells[i].getAttribute('data-coord'));
      ttt.move('X', coords[0], coords[1]);
    };
  })(i), false); 
}



/////////////////////

var myBoard = new Board(['X', null, null, null, null, null, null, null, null]);

var AI = new AIPlayer(myBoard);
