$(function() {
  'use strict';

  var myBoard = $('#tic-tac-toe'),
      myCells = myBoard.find('.board-cell'),
      gameplayToggle = $('#gameplay-toggle');

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

  // Listen for the game end event and add appropriate classes.
  myBoard.on('ttt.on.end', function(e) {
    var boardClass;

    switch (e.state) {
      case 'win':
        boardClass = 'end win win-' + e.winner.toLowerCase();

        // Add special classes to the appropriate pieces
        for (var i in e.winningPoints) {
          myBoard.find('.board-cell').eq(e.winningPoints[i]).addClass('hilite');
        }

        break;

      case 'draw':
        boardClass = 'end draw';
    }

    myBoard.addClass(boardClass);
  });

  // When the board reports that a reset action has occurred.
  myBoard.on('ttt.on.reset', function(e) {
    myCells.removeClass('x o hilite');
    myBoard.removeClass('end win draw win-x win-o');
  });

  // The toggling element that switches gameplay mode.
  gameplayToggle.find('li a').on('click', function() {
    var $this = $(this),
        players;

    // Switch the label
    gameplayToggle.find('.gameplay-label').text($this.text());

    // Get the players
    players = $this.attr('data-value').split('-');

    // Trigger the game
    myBoard.ttt.apply(myBoard, players);
  });

  // Reset button
  $('#reset').on('click', function() {
    myBoard.trigger($.Event('ttt.api.reset'));
  });

  // Kick off an AI-Human game.
  gameplayToggle.find('li a[data-value="ai-human"]').click();
});
