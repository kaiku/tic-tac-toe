var Player;

Player = function() {
	this.board = null;
  this.piece = null;
};

Player.prototype.constructor = Player;

Player.prototype.setBoard = function(board) {
  this.board = board;
};

Player.prototype.setPiece = function(piece) {
  this.piece = piece;
};
