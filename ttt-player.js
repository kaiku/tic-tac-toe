var Player, HumanPlayer;

Player = function() {
  this.piece = null;
  this.opponentPiece = null;
  this.manager = null;
};

Player.prototype.constructor = Player;

Player.prototype.setManager = function(manager) {
  this.manager = manager;
};

Player.prototype.setBoard = function(board) {
  this.board = board;
};

Player.prototype.setPiece = function(piece) {
  this.piece = piece;
  this.opponentPiece = piece === Board.X ? Board.O : Board.X;
};

/**
 * Use the rows to determine if the player has won.
 */
// Player.prototype.hasWon = function() {
//   var rows = Board.DEFAULTS.rows,
//       currentPosition;

//   for (var i in rows) {
//     if (
//       this.board[rows[i][0]] === this.piece &&
//       this.board[rows[i][1]] === this.piece &&
//       this.board[rows[i][3]] === this.piece
//     ) {
//       return true;
//     }
//   }

//   return false;
// };

HumanPlayer = function() {
  Player.call(this);
};

$.extend(HumanPlayer.prototype, Player.prototype);

HumanPlayer.prototype.move = function() {
  return;
};

