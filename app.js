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
  const winCombo = checkWinner();

  if (winCombo) {
    // Highlight winning cells
    winCombo.forEach((i) =>
      document
        .querySelector(`.cell[data-index='${i}']`)
        .classList.add("win-cell")
    );

    // Display winner text
    if (vsComputer && currentPlayer === "O") {
      info.innerHTML = `<span class='winner'>Computer wins! 🏆</span>`;
    } else {
      info.innerHTML = `<span class='winner'>Player ${currentPlayer} wins! 🏆</span>`;
    }

    launchConfetti();

    updateScore(currentPlayer);
    gameActive = false;
    return true;
  }

  if (!cells.includes("")) {
    info.innerHTML = `<span class='draw'>It's a draw! 🤝</span>`;
    updateScore("Draw");

    // Add shake effect to board
    board.classList.add("draw-animate");
    setTimeout(() => board.classList.remove("draw-animate"), 1000);

    gameActive = false;
    return true;
  }

  return false;
}

// Check winning combinations and return indices if win
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

  for (const [a, b, c] of combos) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return [a, b, c];
    }
  }
  return null;
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

board.classList.remove("draw-animate");

// 🎊 Confetti Effect
function launchConfetti() {
  const confettiContainer = document.getElementById("confetti-container");
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    // Randomize color and position
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.width = Math.random() * 8 + 6 + "px";
    confetti.style.height = Math.random() * 8 + 6 + "px";
    confetti.style.animationDuration = 2 + Math.random() * 2 + "s";
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    confettiContainer.appendChild(confetti);

    // Remove after animation
    setTimeout(() => confetti.remove(), 4000);
  }
}

// Page loader animation
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("fade-out");
    document.body.classList.add("loaded");
  }, 1000); // show spinner for 1 second
});

// Page load animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded");

  // Animate board cells popping one by one
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell, i) => {
    cell.style.animationDelay = `${0.5 + i * 0.09}s`;
  });
});
