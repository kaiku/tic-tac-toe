
var tttElement = $('#tic-tac-toe').ttt();

tttElement.find('.cell').on('click', function() {
  // Calculate which cell, 0-8, was clicked and trigger the move.
  var point = $(this).parent().index() * 3 + $(this).index();
  tttElement.trigger($.Event('ttt.api.move', {move: point}));
});

tttElement.on('ttt.on.move', function(e) {
  var board = e.board,
      piece = e.piece,
      point = e.point;

  console.log('ttt.on.move', JSON.stringify(board), piece, point);
});

tttElement.on('ttt.on.reset', function(e) {
  console.log('reset called');
});
