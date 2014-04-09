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
    (row.slice(0, 2).every(isNull) && isMaximizing(row[2])) ||
    (row.slice(1, 2).every(isNull) && isMaximizing(row[0])) ||
    (row[0] === null && row[1] === isMaximizing(maximizing) && row[2] === null);

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
    [0, 4, 8], [2, 4, 6]
  ];

  for (var i in rows) {
    rowValue = [board[rows[i][0]], board[rows[i][1]], board[rows[i][2]]];
    sum += this.computeRowValue(rowValue, maximizing);
  }

  return sum;
};

AIPlayer.prototype.getBoardValue = function(board) {
  var maximizingPiece = this.piece;
  var minimizingPiece = maximizingPiece === 'X' ? 'O' : 'X';
  return this.getPlayerSum(board, maximizingPiece) + (this.getPlayerSum(board, minimizingPiece) * -1);
};

/**
 * @param {Array}
 */
AIPlayer.prototype.getAvailableMoves = function(board) {
  var indexes = [];
  for (var i in board) {
    if (board[i] === null) indexes.push(i);
  }
  return indexes;
};

/**
 * Implements minimax.
 *
 * @param {Board}
 * @param {Integer}
 * @param {Boolean}
 */
AIPlayer.prototype.minimax = function(board, depth, maximizing) {
  var moves = this.getAvailableMoves(board),
      bestMove = null,
      bestValue = maximizing ? -100 : 100,
      localValue;

  if (depth === 0 || !moves.length) {
    bestValue = this.getBoardValue(board);
  } else {
    if (maximizing) {
      for (var i in moves) {
        var newRawBoard = board.slice(0);
        newRawBoard[moves[i]] = this.piece;

        // [bestValue, bestMove]
        localValue = this.minimax(newRawBoard, depth - 1, false);

        //console.log('maximizing', localValue[0], bestValue);

        if (localValue[0] > bestValue) {
          bestMove  = moves[i];
          bestValue = localValue[0];
        }
      }
    } else {
      for (var i in moves) {
        // TODO: cleanup
        var newRawBoard = board.slice(0);
        newRawBoard[moves[i]] = this.piece === 'X' ? 'O' : 'X';

        localValue = this.minimax(newRawBoard, depth - 1, true);
        
        if (localValue[0] < bestValue) {
          bestMove  = moves[i];
          bestValue = localValue[0];          
        }
      }
    }
  }

  return [bestValue, bestMove];
};

AIPlayer.prototype.move = function() {
  // Pick a random square if it's the first move.
  if (this.board.getAvailableMoves().length === 9) {
    return Math.round(Math.random() * 8); 
  }

  var minimaxResult = this.minimax(this.board.getBoard(), 4, true);

  return minimaxResult[1];
};


/////////////////

// var ai = new AIPlayer();
// ai.setPiece('X');
// var value = ai.getBoardValue(['X', 'X', 'X', null, null, null, null, null, null]);
// console.log('VALUE', value);



