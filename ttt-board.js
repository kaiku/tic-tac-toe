var Board;

/**
 * Represents a tic-tac-toe board.
 *
 * @constructor
 */
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

/**
 * @param {String}
 * @return {Boolean}
 */
Board.prototype.isValidMove = function(point) {
  return this.board[point] === null;
};

Board.prototype.move = function(piece, point) {
  if (!this.isValidMove(point)) {
    throw 'Invalid move ' + point + ' for board ' + JSON.stringify(this.board);
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
