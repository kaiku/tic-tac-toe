var AIPlayer;

AIPlayer = function() {
  Player.call(this);
};

$.extend(AIPlayer.prototype, Player.prototype);

AIPlayer.prototype.constructor = AIPlayer;

AIPlayer.prototype.getBoardValue = function(board) {
  var self = this,
      boardArray = board.getBoard(), // TODO: rename getBoard() to getBoardAsArray()
      getRowHeuristicValue,
      sum = 0,
      row;

  // Returns an array
  getRowHeuristicValue = function(row) {
    var score = 0;

    // If first piece is ours, score is 1. If opponents, -1.
    if (row[0] === this.piece) {
      score = 1;
    } else if (row[0] == this.opponentPiece) {
      score = -1;
    }

    // If second piece is ours, and:
    //   If first piece is ours, score is 10.
    //   If first piece is opponents, score is 0.
    //   Otherwise, first piece is blank, score stays at 1.
    // If second piece is opponent, and:
    //   If first piece is opponents, score is -10.
    //   If first piece is ours, score is 0.
    //   Otherwise, first piece is blank, score is -1.
    if (row[1] === this.piece) {
      if (score === 1) {
        score = 10;
      } else if (score === -1) {
        return 0;
      } else {
        score = 1;
      }
    } else if (row[1] === this.opponentPiece) {
      if (score === -1) {
        score = -10;
      } else if (score === 1) {
        return 0;
      } else {
        score = -1;
      }
    }

    // If third piece is ours, and:
    //   If score is positive, multiply by 10.
    //   If score is negative, row is dirty and score is 0.
    //   Otherwise, other cells are empty, score is 1.
    // If third piece is opponent, and:
    //   If score is negative, multiply by 10.
    //   If score is positive, row is dirty and score is 0.
    //   Otherwise, other cells are empty, score is -1.
    if (row[2] === this.piece) {
      if (score > 0) {
        score *= 10;
      } else if (score < 0) {
        return 0;
      } else {
        score = 1;
      }
    } else if (row[2] === this.opponentPiece) {
      if (score < 0) {
        score *= 10;
      } else if (score > 0) {
        return 0;
      } else {
        return -1;
      }
    }

    return score;
  };

  for (var i in Board.DEFAULTS.rows) {
    row = [
      boardArray[Board.DEFAULTS.rows[i][0]],
      boardArray[Board.DEFAULTS.rows[i][1]],
      boardArray[Board.DEFAULTS.rows[i][2]]
    ];

    // testscore = getRowHeuristicValue.call(this, row);
    // console.log(JSON.stringify(row), testscore);
    
    sum += getRowHeuristicValue.call(this, row);
  }

  return sum;
};

/**
 * Implements minimax.
 *
 * @param {Board}
 * @param {Integer}
 * @param {Boolean}
 */

AIPlayer.prototype.minimax = function(board, depth, maximizing) {
  var moves = board.getAvailableMoves(),
      bestMove = null,
      bestValue = maximizing ? -100 : 100,
      localValue,
      clonedBoard;

  if (depth === 0 || !moves.length) {
    bestValue = this.getBoardValue(board);
  } else {
    if (maximizing) {
      for (var i in moves) {
        clonedBoard = board.clone();
        clonedBoard.move(this.piece, moves[i]);

        localValue = this.minimax(clonedBoard, depth - 1, false);

        if (localValue[0] > bestValue) {
          bestMove  = moves[i];
          bestValue = localValue[0];
        }
      }
    } else {
      for (var i in moves) {
        clonedBoard = board.clone();
        clonedBoard.move(this.piece, moves[i]);

        localValue = this.minimax(clonedBoard, depth - 1, true);
        
        if (localValue[0] < bestValue) {
          bestMove  = moves[i];
          bestValue = localValue[0];          
        }
      }
    }
  }

  //console.log('aaa', bestValue, bestMove);
  return [bestValue, bestMove];
};

AIPlayer.prototype.move = function() {
  // Pick a random square if it's the first move.
  if (this.board.getAvailableMoves().length === 9) {
    return Math.round(Math.random() * 8);

    // Pick a specific one
    //return 6;
  }

  var minimaxResult = this.minimax(this.board, 2, true);

  return minimaxResult[1];
};

/////////////////

var ai = new AIPlayer();
ai.setPiece(Board.O);

var myBoard = new Board(['O', null, 'X', null, null, null, 'X', null, null]);

myBoard.drawToConsole();
console.log('value', ai.getBoardValue(myBoard));

// Compare X blocking vertical, or moving to upper right as it seems to be doing.
betterBoard = myBoard.clone();
worseBoard  = myBoard.clone();

betterBoard.move(ai.piece, 4);
worseBoard.move(ai.piece, 1);

// betterBoard.drawToConsole();
// console.log('better value', ai.getBoardValue(betterBoard));
// worseBoard.drawToConsole();
// console.log('worse value', ai.getBoardValue(worseBoard));

// var betterResult = ai.minimax(betterBoard, 1, true);
// var worseResult = ai.minimax(worseBoard, 1, true);
var betterResult = ai.minimax(myBoard, 4, true);

console.log('better result', JSON.stringify(betterResult));
// console.log('worse result', JSON.stringify(worseResult));


