import * as assert from "assert";

import { Game } from "./tictactoe.js";

function test() {
  const game = new Game();
  const expectedBoard = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
  ];

  assert.deepEqual(game.board, expectedBoard);
}

test()
