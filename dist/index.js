module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 443:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __nccwpck_require__) => {

// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./tictactoe.js
function rowSame(row) {
  return row[0] === row[1] && row[1] === row[2] && row[2] !== null;
}

function transpose(table) {
  return table[0].map((_, i) => table.map((row) => row[i]));
}

class Game {
  constructor() {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }

  /**
   * Given the current board, calculate the best move for the current player.
   * Note: this placeholder implementation does random valid moves
   */
  calculateBestMove() {
    if(this.isGameOver()) {
      throw new Error("Game over");
    }

    while(true) {
      const column = Math.floor(Math.random() * 3);
      const row = Math.floor(Math.random() * 3);
      const moveStr = String.fromCodePoint("A".codePointAt() + column) +
            String.fromCodePoint("1".codePointAt() + row);

      if(this.board[row][column] === null) {
        return moveStr;
      }
    }
  }

  /**
   * Mutate the current game with a move coded with a letter followed by a
   * number. The letter denotes the column of the move, while the letter
   * denotes the row. A1 is the bottom left corner and C3 the top right.
   */
  makeMove(move) {
    const column = move[0].codePointAt() - "A".codePointAt();
    const row = 2 - (move[1].codePointAt() - "1".codePointAt());

    if(this.isGameOver()) {
      throw new Error("Game over");
    }

    if(column < 0 || column >= 3 || row < 0 || row >= 3) {
      throw new Error("Invalid move");
    }

    if(this.board[row][column] !== null) {
      throw new Error("Illegal move");
    }

    this.board[row][column] = this.numMoves() % 2 == 0 ? "X" : "O";
  }

  /**
   * Returns the number of moves made in the game. This can be used to
   * determine the current player. Even means X, odd means O.
   */
  numMoves() {
    return this.board.reduce((tableAcc, row) => {
      return tableAcc + row.reduce((rowAcc, x) => {
        return rowAcc + (x !== null ? 1 : 0);
      }, 0);
    }, 0);
  }

  /**
   * Returns whether the game is over. If any row, column or diagonal is filled
   * with the same pieces, the game is won by that player. When the game is
   * over, an even number of moves means that O won, while an odd number of
   * moves means that X won.
   */
  isGameOver() {
    const rows = this.board.some(rowSame);
    const columns = transpose(this.board).some(rowSame);
    const diagonals = (
      rowSame([this.board[0][0], this.board[1][1], this.board[2][2]]) ||
      rowSame([this.board[0][2], this.board[1][1], this.board[2][0]]));
    return rows || columns || diagonals;
  }

  /**
   * Returns a string representation of the current game, including the board
   * and the placed pieces.
   */
  toString() {
    return [
      "_____",
      "3:" + this.board[0].map((x) => x ? x : " ").join(""),
      "2:" + this.board[1].map((x) => x ? x : " ").join(""),
      "1:" + this.board[2].map((x) => x ? x : " ").join(""),
      "__ABC"].join("\n");
  }
}

// CONCATENATED MODULE: ./index.js
const core = require("@actions/core");
const github = require("@actions/github");



const MOVE_COMMENT_PATTERN = /[A-C][1-3]/;

async function post(owner, repo, issuNumber, comment) {
  return await octokit.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: issueNumber,
      body: comment,
  });
}

async function run() {
  try {
    const token = core.getInput("token");

    console.log("Payload:");
    console.log(JSON.stringify(github.context.payload, null, 2));

    const payload = github.context.payload;
    const body = payload.comment.body;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;
    const issueNumber = payload.issue.number;

    if(body.match(MOVE_COMMENT_PATTERN)) {
      let response = "";

      const octokit = github.getOctokit(token);
      const comments = octokit.request(
          "GET /repos/{owner}/{repo}/issues/{issue_number}/comments", {
            owner: owner,
            repo: repo,
            issue_number: issueNumber,
          });
      const moves = comments.filter((c) => c.body.match(MOVE_COMMENT_PATTERN));

      // reconstruct game session
      const game = new Game();
      moves.forEach((c) => game.makeMove(c.body));

      if(game.isGameOver()) {
        await post(owner, repo, issueNumber, "Error: game is already over!");
      } else {
        const counterMove = game.calculateBestMove();
        game.makeMove(counterMove);
        await post(owner, repo, issueNumber, counterMove);

        if(game.isGameOver()) {
          await post(owner, repo, issueNumber, "Game over!");
        }

        await post(owner, repo, issueNumber, game.toString());
      }
    }
  } catch(error) {
    core.setFailed(error.message);
  }
}

run();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(443);
/******/ })()
;