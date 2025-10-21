const board = document.getElementById("board");
const info = document.getElementById("info");
const resetBoardBtn = document.getElementById("resetBoard");
const newGameBtn = document.getElementById("newGame");
const twoPlayerBtn = document.getElementById("twoPlayer");
const vsComputerBtn = document.getElementById("vsComputer");

const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDrawEl = document.getElementById("scoreDraw");

let currentPlayer = "X";
let gameActive = true;
let vsComputer = false;
let cells = Array(9).fill("");
let scoreX = 0,
  scoreO = 0,
  scoreDraw = 0;

// Toggle modes
twoPlayerBtn.addEventListener("click", () => {
  vsComputer = false;
  twoPlayerBtn.classList.add("active");
  vsComputerBtn.classList.remove("active");

  // Reset board and scores
  resetGame();

  // Set score label back to Player O
  document.querySelector(".scores div:nth-child(3)").innerHTML = `
    Player O<br /><span id="scoreO">${scoreO}</span>
  `;
});

vsComputerBtn.addEventListener("click", () => {
  vsComputer = true;
  vsComputerBtn.classList.add("active");
  twoPlayerBtn.classList.remove("active");

  // Reset board and scores
  resetGame();

  // Change score label to Computer
  document.querySelector(".scores div:nth-child(3)").innerHTML = `
    Computer<br /><span id="scoreO">${scoreO}</span>
  `;
});

// Create game board
function createBoard() {
  board.innerHTML = "";
  cells.forEach((cell, i) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.dataset.index = i;
    cellDiv.addEventListener("click", handleClick);
    board.appendChild(cellDiv);
  });
}

// Handle player's move
function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || cells[index]) return;

  makeMove(index, currentPlayer);

  if (checkEnd()) return;

  switchPlayer();

  // If vs computer and it's O's turn
  if (vsComputer && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

// Place move on board
function makeMove(index, player) {
  cells[index] = player;
  const cellDiv = document.querySelector(`.cell[data-index='${index}']`);
  cellDiv.textContent = player;
  cellDiv.classList.add("taken");
}

// Switch turn
function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  info.textContent =
    currentPlayer === "O" && vsComputer
      ? "Computer's turn"
      : `Player ${currentPlayer}'s turn`;
}

// Check for win or draw
function checkEnd() {
  if (checkWinner()) {
    // If VS Computer and O wins, display "Computer wins!"
    if (vsComputer && currentPlayer === "O") {
      info.innerHTML = `<span class='winner'>Computer wins!</span>`;
    } else {
      info.innerHTML = `<span class='winner'>Player ${currentPlayer} wins!</span>`;
    }

    updateScore(currentPlayer);
    gameActive = false;
    return true;
  }

  if (!cells.includes("")) {
    info.innerHTML = `<span class='draw'>It's a draw!</span>`;
    updateScore("Draw");
    gameActive = false;
    return true;
  }

  return false;
}

// Check winning combinations
function checkWinner() {
  const combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return combos.some(
    ([a, b, c]) => cells[a] && cells[a] === cells[b] && cells[a] === cells[c]
  );
}

// Update score
function updateScore(result) {
  if (result === "X") {
    scoreX++;
    scoreXEl.textContent = scoreX;
  } else if (result === "O") {
    scoreO++;
    // Update the O/Computer span after toggle
    document.querySelector(".scores div:nth-child(3) span").textContent =
      scoreO;
  } else {
    scoreDraw++;
    scoreDrawEl.textContent = scoreDraw;
  }
}

// Computer move (random empty cell)
function computerMove() {
  const empty = cells
    .map((v, i) => (v === "" ? i : null))
    .filter((i) => i !== null);
  if (empty.length === 0) return;
  const choice = empty[Math.floor(Math.random() * empty.length)];
  makeMove(choice, "O");

  if (checkEnd()) return;

  switchPlayer();
}

// Reset board (next match)
function resetBoard() {
  cells = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  info.textContent = `Player ${currentPlayer}'s turn`;
  createBoard();
}

// Reset board and scores
function resetGame() {
  resetBoard();
  scoreX = 0;
  scoreO = 0;
  scoreDraw = 0;
  scoreXEl.textContent = 0;
  scoreOEl.textContent = 0;
  scoreDrawEl.textContent = 0;
}

resetBoardBtn.addEventListener("click", resetBoard);
newGameBtn.addEventListener("click", resetGame);

createBoard();
