var AIPlayer;

AIPlayer = function() {
  Player.call(this);
};

$.extend(AIPlayer.prototype, Player.prototype);

AIPlayer.prototype.constructor = AIPlayer;

/**
 * Takes a three-element row and the piece of the maximizing player and computes
 * the value of the row according to our heuristic model.
 * @param {Array}
 * @param {Boolean}
 */
AIPlayer.prototype.computeRowValue = function(row, maximizing) {
  var self = this,
      isMaximizing,
      isNull,
      threeInRow,
      twoInRow,
      oneInRow;

  isMaximizing = function(val) {
    return val === self.piece;
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
  return this.getPlayerSum(this.board, true) + (this.getPlayerSum(this.board, false) * -1);
};

/**
 * Implements minimax.
 *
 * @param {Board}
 * @param {Integer}
 * @param {Boolean}
 */
AIPlayer.prototype.getBestMove = function(board, depth, maximizing) {
  var moves = board.getAvailableMoves();

  if (depth === 0 || !moves.length) {
    return board.getBoardValue();
  }

  var bestMove = moves[Math.round(Math.random() * (moves.length - 1))];

  console.log('Best move', bestMove);
  return bestMove;
};

AIPlayer.prototype.move = function() {
  // Pick a random square if it's the first move.
  if (this.board.getAvailableMoves().length === 9) {
    return Math.round(Math.random() * 8); 
  }

  return this.getBestMove(this.board, 4, true);
};



