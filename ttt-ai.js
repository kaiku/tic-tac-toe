var AIPlayer, Board2;

Board2 = function() {
  this.board = null;
  this.init();
};

Board2.DEFAULTS = {
  board: [null, null, null, null, null, null, null, null, null]
};

Board2.prototype.constructor = Board2;

/**
 * @param {Array}
 */
Board2.prototype.init = function(board) {
  this.board = board || Board2.DEFAULTS.board;
};

/**
 * @return {Array} Array of indexes of available moves (0-8).
 */
Board2.prototype.getAvailableMoves = function() {
  var indexes = [];
  for (var i in this.board) {
    if (this.board[i] === null) indexes.push(i);
  }
  return indexes;
};

// AIPlayer

AIPlayer = function(board, piece) {
  this.board = board;
  this.piece = 'X';
};

AIPlayer.prototype.constructor = AIPlayer;

AIPlayer.prototype.updateBoard = function(board) {
  this.board = board;
};

/**
 * Takes a three-element row and the piece of the maximizing player and computes
 * the value of the row according to our heuristic model.
 */
AIPlayer.prototype.computeRowValue = function(row, maximizing) {
  var isMaximizing,
      isNull,
      threeInRow,
      twoInRow,
      oneInRow;

  isMaximizing = function(val) {
    return val === maximizing;
  };

  isNull = function(val) {
    return val === null;
  };

  threeInRow = row.every(isMaximizing);

  if (threeInRow) return 100;

  twoInRow =
    (row.slice(0, 2).every(isMaximizing) && row[2] === null) ||
    (row.slice(1, 2).every(isMaximizing) && row[0] === null);

  if (twoInRow) return 10;

  oneInRow =
    (row.slice(0, 2).every(isNull) && row[2] === maximizing) ||
    (row.slice(1, 2).every(isNull) && row[0] === maximizing) ||
    (row[0] === null && row[1] === maximizing && row[2] === null);

  if (oneInRow) return 1;

  return 0;
};

AIPlayer.prototype.getPlayerSum = function(board, maximizing) {
  var sum = 0,
      rows,
      rowValue;

  rows = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 7], [2, 4, 6]
  ];

  for (var i in rows) {
    rowValue = [board[rows[i][0]], board[rows[i][1]], board[rows[i][2]]];
    sum += this.computeRowValue(rowValue, maximizing);
  }

  return sum;
};

AIPlayer.prototype.getBoardValue = function() {
  return this.getPlayerSum(this.board, 'X') + (this.getPlayerSum(this.board, 'O') * -1);
};

AIPlayer.prototype.minimax = function(board, depth, maximizingPlayer) {
  var moves = board.getAvailableMoves();
};

/////////////////////

var myBoard = new Board2(['X', null, null, null, null, null, null, null, null]);

var AI = new AIPlayer(myBoard);

console.log('Board value', AI.getBoardValue());

//console.log(getBoardValue(myBoard));