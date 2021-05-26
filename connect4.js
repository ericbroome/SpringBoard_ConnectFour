/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie).
 * Would have been way better to use divs as columns and ignore the whole "row" thing but...
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
let numPlays = 0;
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for(let col = 0; col < HEIGHT; col++) {
    board.push(Array.from({length: WIDTH}));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.querySelector("#board");
  if(!htmlBoard)return null;

  // Create a table row for adding pieces  and assign a click event handler
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (var x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create table cells for the game board
  for (let y = HEIGHT - 1; y >= 0; --y) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for(let y = 0; y < HEIGHT; y++) {
    if(board[y][x])continue;
    return y;
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  let piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(currPlayer == 1 ? "red" : "blue");
  const cell = document.getElementById(`${y}-${x}`);
  cell.append(piece);

}

/** endGame: announce game end */

function endGame(msg = null) {
  alert(msg ? msg : "Game Over");
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  /*  Now that we made it this far and nobody won, check to see if the number of plays
    equals the number of cells. If so, we have a tie. We'll verify that by calling checkForTie.
  */
  if(++numPlays >= HEIGHT * WIDTH) {
    checkForTie();
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}


/* check for tie
   Wrote my own but the solution was different so I put the solution in a function
   which is only called when the total number of plays has occurred and nobody won
*/
const checkForTie = function() {
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }
}


/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

/* Starting at the top left, create arrays of 4 cells each and check for a win.
    This function actually goes out of bounds. A more efficient way would be to
    create lookup tables of the possible wins while creating the board.
*/

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
