var AIPlayer;

AIPlayer = function() {
  Player.call(this);
};

$.extend(AIPlayer.prototype, Player.prototype);

AIPlayer.prototype.constructor = AIPlayer;

AIPlayer.prototype.getBoardValue = function(board) {
  var self = this,
      boardArray = board.toArray(),
      getRowValue,
      sum = 0,
      row;

  getRowValue = function(row) {
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

  for (var i in Board.ROWS) {
    row = [
      boardArray[Board.ROWS[i][0]],
      boardArray[Board.ROWS[i][1]],
      boardArray[Board.ROWS[i][2]]
    ];
    
    sum += getRowValue.call(this, row);
  }

  return sum;
};

/**
 * @param {Board}
 * @param {Integer}
 * @param {Boolean}
 * @param {Integer}
 * @param {Integer}
 */
AIPlayer.prototype.minimax = function(board, depth, maximizing, alpha, beta) {
  var moves = board.getAvailableMoves(),
      potentialMoves = [],
      bestValue = maximizing ? -Infinity : Infinity,
      bestMove,
      childBoard,
      minimaxResult;

  // Return the value/move if game is in a terminal state or we're at our depth.
  if (depth === 0 || !moves.length) {
    return [this.getBoardValue(board), bestMove];
  }

  if (maximizing) { // This AI
    for (var i in moves) {
      // Copy the current board and push a move on it.
      childBoard = board.clone();
      childBoard.move(this.piece, moves[i]);

      // Returns an array of [value, move index].
      minimaxResult = this.minimax(childBoard, depth - 1, !maximizing, alpha, beta);

      if (minimaxResult[0] > alpha) { // Is the largest value yet.
        alpha = minimaxResult[0];
        bestValue = alpha;
        bestMove = moves[i];
      }

      if (alpha >= beta) break;
    }
  } else { // Opponent
    for (var i in moves) {
      childBoard = board.clone();
      childBoard.move(this.opponentPiece, moves[i]);

      minimaxResult = this.minimax(childBoard, depth - 1, !maximizing, alpha, beta);

      if (minimaxResult[0] < beta) { // Is the smallest value yet.
        beta = minimaxResult[0];
        bestValue = beta;
        bestMove = moves[i];
      }

      if (alpha >= beta) break;
    }
  }

  return [bestValue, bestMove];
};

AIPlayer.prototype.move = function() {
  var board = this.manager.getBoard(),
      numAvailableMoves = board.getAvailableMoves().length,
      move;

  // Save the board.
  this.board = board;

 // Pick a random square if first move.
  if (numAvailableMoves === 9) {
    move = Math.floor(Math.random() * numAvailableMoves);
  } else {
    move = this.minimax(this.board, 1, true, -Infinity, Infinity)[1];
  }

  this.manager.move(move);
};

