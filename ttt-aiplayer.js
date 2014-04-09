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
    
    sum += getRowHeuristicValue.call(this, row);
  }

  return sum;
};

AIPlayer.prototype.minimax = function(board, depth, maximizing, alpha, beta) {
  var moves = board.getAvailableMoves(),
      potentialMoves = [],
      bestValue = maximizing ? -Infinity : Infinity,
      bestMove;

  if (depth === 0 || !moves.length) {
    return [this.getBoardValue(board), bestMove];
  }

  if (maximizing) {
    for (var i in moves) {
      var childBoard = board.clone();
      childBoard.move(this.piece, moves[i]);

      // Create a new "child" board, move the piece, and calculate the minimax on that.
      // Returns an array of [value, move index].
      var result = this.minimax(childBoard, depth - 1, !maximizing, alpha, beta);

      if (result[0] > alpha) {
        alpha = result[0];
        bestValue = alpha;
        bestMove = moves[i];
      }
      if (alpha >= beta) break;
    }
  } else {
    for (var i in moves) {
      var childBoard = board.clone();
      childBoard.move(this.opponentPiece, moves[i]);

      // Create a new "child" board, move the piece, and calculate the minimax on that.
      // Returns an array of [value, move index].
      var result = this.minimax(childBoard, depth - 1, !maximizing, alpha, beta);

      if (result[0] < beta) {
        beta = result[0];
        bestValue = beta;
        bestMove = moves[i];
      }
      if (alpha >= beta) break;
    }
  }

  return [bestValue, bestMove];
};


AIPlayer.prototype.move = function() {
  var numAvailableMoves = this.board.getAvailableMoves().length,
      bound = numAvailableMoves + 1;

  // Pick the upper right square if this is the first move.
  if (numAvailableMoves === 9) return Math.floor(Math.random() * 9);

  var minimaxResult = this.minimax(this.board, 4, true, -Infinity, Infinity);

  return minimaxResult[1];
};

