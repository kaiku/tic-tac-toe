var Point, XPoint, OPoint, Board;

/**
 * Point
 */
Point = function(label, x, y) {
  this.label = label;
  this.x = x;
  this.y = y;
};

Point.prototype.constructor = Point;

Point.prototype.getLabel = function() {
  return this.label;
};

Point.prototype.getX = function() {
  return this.x;
};

Point.prototype.getY = function() {
  return this.y;
};

/**
 * XPoint
 */
XPoint = function(x, y) {
  Point.call(this, 'X', x, y);
};

XPoint.prototype = Point.prototype;

/**
 * OPoint
 */
OPoint = function(x, y) {
  Point.call(this, 'O', x, y);
};

OPoint.prototype = Point.prototype;

/**
 * Board
 */
Board = function(options) {
  this.options = options;
  this.currentTurn = 'X';
  this.board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
};

Board.DEFAULTS = {};

Board.prototype.constructor = Board;

Board.prototype.isValidMove = function(point) {
  if (!(point instanceof Point)) {
    throw 'Param must be a valid point.';
  }

  // Move is valid if no move has been made in that box yet.
  return this.board[point.getY()][point.getX()] === null;
};

Board.prototype.move = function(point) {
  var x, y;

  if (!this.isValidMove(point)) {
    throw 'Invalid move by "' + point.getLabel() + '" at (' + point.getX() + ',' + point.getY() + ')';
  }

  x = point.getX();
  y = point.getY();

  this.board[y][x] = point;
};

/**
 * Renders the tic-tac-toe board in the console.
 */
Board.prototype.drawToConsole = function() {
  var i, j, row, point, value;

  console.log('   +-----------+ ');

  for (var i in this.board) {
    row = [];

    for (var j in this.board[i]) {
      point = this.board[i][j];
      value = point && point.getLabel() || ' ' ;
      row.push(value);
    }

    console.log(' ' + i + ' | ' + row.join(' | ') + ' | ');
  }

  console.log('   +-----------+ ');
};

////////////////

var board = new Board();

var x0 = new XPoint(0, 0);
var o0 = new OPoint(2, 0);

board.move(x0);
board.move(o0);

board.drawToConsole();
