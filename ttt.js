var Point, XPoint, OPoint, Board, Player, TicTacToe;

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

XPoint = function(x, y) {
  Point.call(this, 'X', x, y);
};

XPoint.prototype = Point.prototype;

XPoint.prototype.constructor = XPoint;

OPoint = function(x, y) {
  Point.call(this, 'O', x ,y);
};

OPoint.prototype = Point.prototype;

OPoint.prototype.constructor = OPoint;

/**
 * Board
 */
Board = function(options) {
  this.board = null;
  this.init();
};

Board.prototype.constructor = Board;

Board.prototype.init = function() {
  this.board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
};

Board.prototype.isValidMove = function(point) {
  if (!(point instanceof Point)) {
    throw 'Param must be a valid point.';
  }

  // Move is valid if no move has been made in that box yet.
  return this.board[point.getY()][point.getX()] === null;
};

Board.prototype.move = function(point) {
  if (!this.isValidMove(point)) {
    throw 'Invalid move by "' + point.getLabel() + '" at (' + point.getX() + ',' + point.getY() + ')';
  }

  this.board[point.getY()][point.getX()] = point;
};

Board.prototype.getBoard = function() {
  return this.board;
};

/**
 * Renders the tic-tac-toe board in the console.
 */
Board.prototype.drawToConsole = function() {
  var output = [], row, point, value;

  output.push('   +-----------+ ');

  for (var i in this.board) {
    row = [];

    for (var j in this.board[i]) {
      point = this.board[i][j];
      value = point && point.getLabel() || ' ' ;
      row.push(value);
    }

    output.push(' ' + i + ' | ' + row.join(' | ') + ' | ');
  }

  output.push('   +-----------+ ');

  for (var k in output) {
    console.log(output[k]);
  }
};

Player = function() {
};

/**
 * TicTacToe
 */
TicTacToe = function(options) {
  this.options = options;
  this.board = new Board();
  this.started = false;
  this.whoseTurn = 0;
  this.players = [];

  this.start();
};

TicTacToe.prototype.constructor = TicTacToe;

TicTacToe.prototype.start = function() {
  this.started = true;
  this.board.drawToConsole();
};

TicTacToe.prototype.move = function(type, x, y) {
  var point = type === 'X' ? new XPoint(x, y) : new OPoint(x, y);

  try {
    this.board.move(point);
    this.board.drawToConsole();
  } catch (e) {}
};

TicTacToe.prototype.reset = function() {
  // TODO: pull these from defaults
  this.started = false;
  this.whoseTurn = 0;

  // Redraw the board
  this.board.init();
  this.board.drawToConsole();
};


////////////////

var ttt = new TicTacToe();

var cells = document.getElementsByClassName('cell');

for (var i = 0; i < cells.length; i++) {
  cells[i].addEventListener('click', (function(i) {
    return function() {
      var coords = JSON.parse(cells[i].getAttribute('data-coord'));
      ttt.move('X', coords[0], coords[1]);
    };
  })(i), false); 
}