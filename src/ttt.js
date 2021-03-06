if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}

(function($) {
  'use strict';

  var TicTacToe, Board, Player, HumanPlayer, AIPlayer;


  /* ========================================================================
   * TicTacToe
   * The game-coordinating object.
   * ======================================================================== */


  TicTacToe = function(element, player1, player2, options) {
    var X = Board.X,
        O = Board.O,
        self = this;

    this.$element = $(element);
    this.options = $.extend({}, TicTacToe.DEFAULTS, options);
    this.board = null;
    this.currentPiece = X;
    this.players = {
      X: player1,
      O: player2
    };

    // Call off before on to ensure we don't double bind the event when
    // re-initializing the gameplay.

    this.$element
      .off('ttt.api.move')
      .on('ttt.api.move', function(e) {
        self.move.call(self, e.move);
      });

    this.$element
      .off('ttt.api.reset')
      .on('ttt.api.reset', function() {
        self.reset.call(self);
      });

    if (this.options.autostart) {
      this.reset();
    }
  };

  TicTacToe.DEFAULTS = {
    autostart: true
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
      if (this.players.hasOwnProperty(piece)) {
        this.players[piece].setPiece(piece);
        this.players[piece].setManager(this);
      }
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
    var self = this,
        winPointsX,
        winPointsO;

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
        winPointsX = this.board.isWin(Board.X);
        winPointsO = this.board.isWin(Board.O);

        if (winPointsX) {
          this.$element.trigger($.Event('ttt.on.end', {
            state: 'win',
            winner: Board.X,
            winningPoints: winPointsX
          }));
        } else if (winPointsO) {
          this.$element.trigger($.Event('ttt.on.end', {
            state: 'win',
            winner: Board.O,
            winningPoints: winPointsO
          }));
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


  /* ========================================================================
   * Board
   * The board is represented by a flat, nine-element array.
   * ======================================================================== */


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
   * Returns an array of indexes of available moves (0-8).
   */
  Board.prototype.getAvailableMoves = function() {
    var indexes = [];

    // No more moves if either player has won.
    if (this.isWin(Board.X) || this.isWin(Board.O)) {
      return indexes;
    }

    for (var i = 0; i < this.board.length; i++) {
      if (this.board[i] === null) indexes.push(parseInt(i));
    }
    return indexes;
  };

  /**
   * Takes a piece and returns the array of points (row) of the win, or false.
   */
  Board.prototype.isWin = function(piece) {
    var rows = Board.ROWS;

    for (var i = 0; i < rows.length; i++) {
      if (
        this.board[rows[i][0]] === piece &&
        this.board[rows[i][1]] === piece &&
        this.board[rows[i][2]] === piece
      ) {
        return rows[i];
      }
    }

    return false;
  };

  /**
   * Was the game a draw?
   */
  Board.prototype.isDraw = function() {
    return this.getAvailableMoves().length === 0 &&
        !this.isWin(Board.X) &&
        !this.isWin(Board.O);
  };

  /**
   * Is the game in a terminal state?
   */
  Board.prototype.isGameOver = function() {
    return this.getAvailableMoves().length === 0;
  };

  /**
   * Can that move be made on the board, i.e. is the space free?
   */
  Board.prototype.isValidMove = function(point) {
    return this.board[point] === null;
  };

  /**
   * Moves a piece to the given point 0-8.
   */
  Board.prototype.move = function(piece, point) {
    if (!this.isValidMove(point)) {
      throw 'Invalid move ' + point + ' for board ' + JSON.stringify(this.board);
    }

    this.board[point] = piece;
  };

  /**
   * Copies the board and returns a new board object.
   */
  Board.prototype.clone = function() {
    return new Board(this.board.slice(0));
  };

  /**
   * Returns the array representation of the board.
   */
  Board.prototype.toArray = function() {
    return this.board;
  };

  /**
   * Renders the tic-tac-toe board in the console.
   */
  Board.prototype.drawToConsole = function() {
    var output = [],
        row,
        formatter;

    formatter = function(val) {
      return val === null ? ' ' : val;
    };

    output.push('   +-----------+ ');

    for (var i = 0; i < 3; i++) {
      row = this.board.slice(i * 3, i * 3 + 3).map(formatter);
      output.push(' ' + i + ' | ' + row.join(' | ') + ' | ');
    }

    output.push('   +-----------+ ');

    for (var k = 0; k < output.length; k++) {
      console.log(output[k]);
    }
  };


  /* ========================================================================
   * Player
   * ======================================================================== */


  Player = function() {
    this.piece = null;
    this.opponentPiece = null;
    this.manager = null;
  };

  Player.prototype.constructor = Player;

  Player.prototype.setManager = function(manager) {
    this.manager = manager;
  };

  Player.prototype.setPiece = function(piece) {
    this.piece = piece;
    this.opponentPiece = piece === Board.X ? Board.O : Board.X;
  };

  /**
   * This method is called by the manager and indicates when this player should move.
   */
  Player.prototype.move = function() {
    return;
  };


  /* ========================================================================
   * HumanPlayer
   * ======================================================================== */


  HumanPlayer = function() {};

  HumanPlayer.prototype = Object.create(Player.prototype);

  HumanPlayer.prototype.constructor = HumanPlayer;

  HumanPlayer.type = 'human';


  /* ========================================================================
   * AIPlayer
   * ======================================================================== */


  AIPlayer = function(options) {
    Player.call(this);
    this.options = $.extend({}, AIPlayer.DEFAULTS, options);
  };

  AIPlayer.prototype = Object.create(Player.prototype);

  AIPlayer.DEFAULTS = {
    moveDelay: 0
  };

  AIPlayer.type = 'ai';

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
   * Implements minimax with alpha-beta pruning.
   */
  AIPlayer.prototype.minimax = function(board, depth, maximizing, alpha, beta) {
    var moves = board.getAvailableMoves(),
        potentialMoves = [],
        bestValue = maximizing ? -Infinity : Infinity,
        bestMove,
        childBoard,
        minimaxResult,
        i;

    // Return the value/move if game is in a terminal state or we're at our depth.
    if (depth === 0 || !moves.length) {
      return [this.getBoardValue(board), bestMove];
    }

    if (maximizing) { // This AI
      for (i = 0; i < moves.length; i++) {
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
      for (i = 0; i < moves.length; i++) {
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
        self = this,
        move;

    // Save the board.
    this.board = board;

   // Pick a random square if first move.
    if (numAvailableMoves === 9) {
      move = Math.floor(Math.random() * numAvailableMoves);
    } else {
      move = this.minimax(this.board, 8, true, -Infinity, Infinity)[1];
    }

    setTimeout($.proxy(function() {
      this.manager.move(move);
    }, this), this.options.moveDelay);
  };


  /* ========================================================================
   * jQuery plugin definition
   * Usage: $('#element').ttt('human', 'ai')
   * ======================================================================== */


  $.fn.ttt = function(player1, player2, options) {
    return this.each(function() {
      var $this = $(this),
          aiOptions = {},
          player1Obj,
          player2Obj;

      options = options || {};

      // Defaults.
      player1 = player1 || 'human';
      player2 = player2 || 'ai';

      // If two AI players are playing against each other, delay moves.
      if (player1 === 'ai' && player2 === 'ai') {
        aiOptions = {moveDelay: 300};
      }

      player1Obj = player1 === 'human' ? new HumanPlayer() : new AIPlayer(aiOptions);
      player2Obj = player2 === 'human' ? new HumanPlayer() : new AIPlayer(aiOptions);

      $this.data('ttt', new TicTacToe(this, player1Obj, player2Obj, options));
    });
  };

  $.fn.ttt.Constructor = TicTacToe;
}(jQuery));
