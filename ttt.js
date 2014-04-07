var Point, XPoint, OPoint, Board, TicTacToe;

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
  if (!this.isValidMove(point)) {
    throw 'Invalid move by "' + point.getLabel() + '" at (' + point.getX() + ',' + point.getY() + ')';
  }

  this.board[point.getY()][point.getX()] = point;
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

/**
 * TicTacToe
 */
TicTacToe = function(options) {
  this.options = options;
  this.board = new Board();
  this.state = {
    started: false,
    whoseTurn: 'X'
  };

  this.start();
};

TicTacToe.DEFAULTS = {};

TicTacToe.prototype.constructor = TicTacToe;

TicTacToe.prototype.start = function() {
  this.state.started = true;
  this.board.drawToConsole();
};

TicTacToe.prototype.move = function(type, x, y) {
  var point;

  point = new Point(type, x, y);
  this.board.move(point);
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