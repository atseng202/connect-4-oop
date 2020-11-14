"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  /*
   * sets height and width of board and creates the board
   * also sets initial player to 1
   */
  constructor(width = 7, height = 6) {
    this.width = width;
    this.height = height;
    this.gameIsOver = false;
    // Bind event listeners to game instance
    this.handleClick = this.handleClick.bind(this);
    this.startGame = this.startGame.bind(this);
    // Add start game event listener
    let newGameButton = document.querySelector("#start");
    newGameButton.addEventListener("click", this.startGame);
  }

  /* startGame: starts or restarts a new game of C4
   * board state should be reset, HTML reset, currPlayer back to 1
   */
  startGame(evt) {
    evt.preventDefault()
    this.gameIsOver = false;
    let color1 = document.querySelector("#color1").value;
    let color2 = document.querySelector("#color2").value;
    this.player1 = new Player(color1, "Player1");
    this.player2 = new Player(color2, "Player2");
    this.currPlayer = this.player1;
    this.board = this.makeBoard();
    this.clearHTMLBoard();
    this.makeHtmlBoard();
  }

  /** clearHTMLBoard: remove HTML for current board,
     * create new blank HTML board.
     */
  clearHTMLBoard() {
    let boardElement = document.querySelector("#board");
    boardElement.remove();
    boardElement = document.createElement("table");
    boardElement.setAttribute("id", "board");
    let game = document.querySelector("#game");
    game.append(boardElement);
  }
  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  makeBoard() {
    let board = [];
    for (let y = 0; y < this.height; y++) {
      board.push(Array.from({ length: this.width }));
    }
    return board;
  }

  // ** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById("board");

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add(`p${this.currPlayer.name}`);
    piece.style.background = this.currPlayer.color;


    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    this.gameIsOver = true;
    document.getElementsByTagName("h1")[0].innerText = `${msg}`;
    setTimeout(function () { alert(msg); }, 1000);

  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    if (this.gameIsOver) return;
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.name;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.name} won!`);
    }

    // check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }

    // switch players
    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  };

  // Check four cells to see if they're all color of current player
  //  - cells: list of four (y, x) cells
  //  - returns true if all are legal coordinates & all match currPlayer
  _win(cells) {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer.name
    );
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
          return true;
        }
      }
    }
  }
}

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player {
  constructor(colorName, name) {
    this.color = colorName;
    this.name = name;
  }
}

const connect4Game = new Game();
