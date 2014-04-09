var Board;

/**
 * Represents a tic-tac-toe board.
 *
 * @constructor
 */
Board = function(board) {
  this.board = board || [null, null, null, null, null, null, null, null, null];
  this.turn  = Board.X;
};

Board.X = 'X';

Board.O = 'O';

Board.ROWS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

Board.prototype.constructor = Board;

/**
 * @return {Array} Array of indexes of available moves (0-8).
 */
Board.prototype.getAvailableMoves = function() {
  var indexes = [];

  // No more moves if either player has won.
  if (this.isWin(Board.X) || this.isWin(Board.O)) {
    return indexes;
  }

  for (var i in this.board) {
    if (this.board[i] === null) indexes.push(i);
  }
  return indexes;
};

/**
 * @param {String}
 * @return {Boolean}
 */
Board.prototype.isWin = function(piece) {
  var rows = Board.ROWS;

  for (var i in rows) {
    if (
      this.board[rows[i][0]] === piece &&
      this.board[rows[i][1]] === piece &&
      this.board[rows[i][2]] === piece
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Is a draw if there are no more moves and neither player has won.
 *
 * @return {Boolean}
 */
Board.prototype.isDraw = function() {
  return this.getAvailableMoves().length === 0 &&
      !this.isWin(Board.X) &&
      !this.isWin(Board.O);
};

Board.prototype.isGameOver = function() {
  return this.getAvailableMoves().length === 0;
};

/**
 * @param {String}
 * @return {Boolean}
 */
Board.prototype.isValidMove = function(point) {
  return this.board[point] === null;
};

/**
 * @param {String}
 * @param {Integer}
 */
Board.prototype.move = function(piece, point) {
  if (!this.isValidMove(point)) {
    throw 'Invalid move ' + point + ' for board ' + JSON.stringify(this.board);
  }

  this.board[point] = piece;
};

/**
 * @return {Array}
 */
Board.prototype.clone = function() {
  return new Board(this.board.slice(0));
};

/**
 * @return {Array}
 */
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
