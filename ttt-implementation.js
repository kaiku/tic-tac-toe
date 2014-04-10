$(function() {
  var myBoard = $('#tic-tac-toe').ttt('human', 'ai'),
      myCells = myBoard.find('.board-cell');

  // Handle cell clicking.
  myCells.on('click', function() {
    // Calculate which cell, 0-8, was clicked and trigger the move.
    //var point = $(this).parent().index() * 3 + $(this).index();
    var point = $(this).index();
    myBoard.trigger($.Event('ttt.api.move', {move: point}));
  });

  // Respond to move events.
  myBoard.on('ttt.on.move', function(e) {
    var board = e.board,
        piece = e.piece,
        point = e.point;

    myBoard.find('.board-cell').eq(point).addClass(piece.toLowerCase());
  });

  // When the board reports that a reset action has occurred.
  myBoard.on('ttt.on.reset', function(e) {
    myCells.removeClass('x o');
    myBoard.removeClass('end win draw win-x win-o');
  });

  // Listen for the game end event and add appropriate classes.
  myBoard.on('ttt.on.end', function(e) {
    var className;

    switch (e.state) {
      case 'win':
        className = 'end win win-0 win-' + e.winner.toLowerCase();
        break;

      case 'draw':
        className = 'end draw';
    }

    myBoard.addClass(className);
  })

  // Reset button
  $('#reset').on('click', function() {
    myBoard.trigger($.Event('ttt.api.reset'));
  });
});
