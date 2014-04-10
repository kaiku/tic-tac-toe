$(function() {
  var myBoard = $('#tic-tac-toe').ttt('human', 'ai'),
      myCells = myBoard.find('.board-cell');

  // Handle cell clicking.
  myCells.on('click', function() {
    // Calculate which cell, 0-8, was clicked and trigger the move.
    var point = $(this).parent().index() * 3 + $(this).index();
    myBoard.trigger($.Event('ttt.api.move', {move: point}));
  });

  // Respond to move events.
  myBoard.on('ttt.on.move', function(e) {
    var board = e.board,
        piece = e.piece,
        point = e.point,
        column = Math.floor(e.point / 3),
        row = e.point % 3;


    $(this).find('[data-cell="' + point + '"]').addClass(piece.toLowerCase());

    console.log('ttt.on.move', JSON.stringify(board), piece, point);
  });

  myBoard.on('ttt.on.reset', function(e) {
    myCells.each(function() {
      $(this).removeClass('x o');
    });
  });

  // Reset button
  $('#reset').on('click', function() {
    myBoard.trigger($.Event('ttt.api.reset'));
  });
});
