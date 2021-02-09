function rowSame(row) {
  return row[0] === row[1] && row[1] === row[2] && row[2] !== null;
}

function transpose(table) {
  return table[0].map((_, i) => table.map((row) => row[i]));
}

export class Game {
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
