import * as assert from "assert";

import { Game } from "./tictactoe.js";

function test_empty() {
  const expectedBoard = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
  ];
  const game = new Game();
  assert.deepEqual(game.board, expectedBoard);
}

function test_make_move() {
  const expectedBoard = [
      [ "X", null,  "O"],
      [null,  "X", null],
      [null, null, null],
  ];
  const game = new Game();
  game.makeMove("B2");
  game.makeMove("C3");
  game.makeMove("A3");
  assert.deepEqual(game.board, expectedBoard);
}

test_empty();
test_make_move();
