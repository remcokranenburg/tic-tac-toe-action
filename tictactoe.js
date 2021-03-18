function rowSame(row) {
  return row[0] === row[1] && row[1] === row[2] && row[2] !== null;
}

function transpose(table) {
  return table[0].map((_, i) => table.map((row) => row[i]));
}

function moveToStr(column, row) {
  return String.fromCodePoint("A".codePointAt() + column) +
      String.fromCodePoint("1".codePointAt() + (2 - row));
}

function strToMove(str) {
  const column = str[0].codePointAt() - "A".codePointAt();
  const row = 2 - (str[1].codePointAt() - "1".codePointAt());
  return [column, row];
}

export class Game {
  constructor(game) {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];

    if(game !== undefined) {
      for(let i = 0; i < this.board.length; i++) {
        for(let j = 0; j < this.board[i].length; j++) {
          this.board[i][j] = game.board[i][j];
        }
      }
    }
  }

  findPossibleMoves() {
    const possibleMoves = [];

    for(let i = 0; i < this.board.length; i++) {
      for(let j = 0; j < this.board[i].length; j++) {
        if(this.board[i][j] == null) {
          possibleMoves.push(moveToStr(j, i));
        }
      }
    }

    return possibleMoves;
  }

  scorePossibleMoves(depth) {
    const scoredMoves = [];

    for(const move of this.findPossibleMoves()) {
      const next = new Game(this);
      next.makeMove(move);

      let score = 0;

      if(next.isGameOver()) {
        if(next.hasWinner()) {
          if(this.isTurnOfX()) {
            score = 10 - depth;
          } else {
            score = -10 + depth;
          }
        } else {
          score = 0;
        }
      } else {
        const nextScores = next.scorePossibleMoves(depth + 1);

        // next player will move against this player: if current is X, next
        // will minimize score and if current is O, next will maximize score
        if(this.isTurnOfX()) {
          score = nextScores[0].score;
        } else {
          score = nextScores[nextScores.length - 1].score;
        }
      }

      scoredMoves.push({ move: move, score: score });
    }

    scoredMoves.sort((a, b) => a.score < b.score ? -1 : 1);

    return scoredMoves;
  }

  /**
   * Given the current board, calculate the best move for the current player.
   */
  calculateBestMove() {
    if(this.isGameOver()) {
      throw new Error("Game over");
    }

    const moveScores = this.scorePossibleMoves(0);

    if(this.isTurnOfX()) {
      return moveScores[moveScores.length - 1].move;
    } else {
      return moveScores[0].move;
    }
  }

  /**
   * Mutate the current game with a move coded with a letter followed by a
   * number. The letter denotes the column of the move, while the letter
   * denotes the row. A1 is the bottom left corner and C3 the top right.
   */
  makeMove(moveStr) {
    const [column, row] = strToMove(moveStr);

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
   * Returns whether the game is over. The game is over when there is a winner
   * or if the board is full.
   */
  isGameOver() {
    const isFull = !this.board.some((row) => row.some((c) => c === null));
    return this.hasWinner() || isFull;
  }

  /**
   * Returns whether X should make a move
   */
  isTurnOfX() {
    return this.numMoves() % 2 == 0;
  }

  /**
   * Returns whether the game has a winner. If any row, column or diagonal is
   * filled with the same pieces, the game is won by that player. When there is
   * a winner, an even number of moves means that O won, while an odd number of
   * moves means that X won.
   */
  hasWinner() {
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
