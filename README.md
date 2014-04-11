# Tic-tac-toe

## Initial setup

Run `npm install` to install development dependencies. Use `grunt watch` to keep the examples folder in sync with the source file while developing, and then use `grunt` to make sure everything is neat and tidy when you're done.

See the example by running `npm server.js`. Specify a port other than the default of 8080 with `npm server.js 9090`.

## About the game

The game's AI is a variable-depth minimax algorithm with alpha-beta pruning. The default depth setting is such that any human player should not be able to beat the AI; and that two AIs playing each other should always draw.

Gameplay is configurable: a human may play an AI, or two humans (or two AIs) may play each other. See the example for a demo.
