let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let currentPlayer = "X";
let gameActive = true;

let statustext = document.querySelector("#status");
let score = document.querySelector("#score");
let score2 = document.querySelector("#score2");

let scorex = parseInt(localStorage.getItem("scorex")) || 0;
let scoreo = parseInt(localStorage.getItem("scoreo")) || 0;


score.textContent = "Player X: " + scorex;
score2.textContent = "Player O: " + scoreo;

function handleclick(row, col) {
  if (!gameActive || board[row][col] !== "") return;

  board[row][col] = currentPlayer;
  renderBoard();

  const result = checkWinner();

  if (result) {
    gameActive = false;
    showWinner(result.winner);
    highlightWinningLine(result);
    return;
  }

  if (checkDraw()) {
    gameActive = false;
    showDraw();
    return;
  }

  togglePlayer();
}

function togglePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statustext.textContent = currentPlayer + " Turn";
}

function checkWinner() {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === board[i][1] &&
      board[i][0] === board[i][2] &&
      board[i][0] !== ""
    ) {
      return { winner: board[i][0], type: "row", index: i };
    }
  }

  for (let j = 0; j < 3; j++) {
    if (
      board[0][j] === board[1][j] &&
      board[0][j] === board[2][j] &&
      board[0][j] !== ""
    ) {
      return { winner: board[0][j], type: "col", index: j };
    }
  }

  if (
    board[0][0] === board[1][1] &&
    board[0][0] === board[2][2] &&
    board[0][0] !== ""
  ) {
    return { winner: board[0][0], type: "diag", index: 0 };
  }

  if (
    board[0][2] === board[1][1] &&
    board[0][2] === board[2][0] &&
    board[0][2] !== ""
  ) {
    return { winner: board[0][2], type: "diag", index: 1 };
  }

  return null;
}

function checkDraw() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") return false;
    }
  }
  return true;
}

function resetBoard() {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("win");
  });
  gameActive = true;
  currentPlayer = "X";
  renderBoard();
  statustext.textContent = currentPlayer + " Turn";
}

function restartBoard() {
  resetBoard();
  scorex = 0;
  scoreo = 0;
  localStorage.setItem("scorex", scorex);
  localStorage.setItem("scoreo", scoreo);
  score.textContent = "Player X: 0";
  score2.textContent = "Player O: 0";
}

function renderBoard() {
  document.querySelectorAll(".cell").forEach((cell) => {
    let row = cell.dataset.row;
    let col = cell.dataset.col;
    let value = board[row][col];
    cell.textContent = value;

    if (value === "X") {
      cell.style.color = "#ff33cc"; 
      cell.style.textShadow = "0 0 10px #ff33cc, 0 0 20px #ff66dd";
    } else if (value === "O") {
      cell.style.color = "#ff8800"; 
      cell.style.textShadow = "0 0 10px #ff8800, 0 0 20px #ffaa33";
    } else {
      cell.style.color = "#0ff"; 
      cell.style.textShadow = "0 0 10px #0ff, 0 0 20px #0ff";
    }
  });
}



function showWinner(winner) {
  statustext.textContent = winner + " Wins!";
  if (winner === "X") {
    scorex++;
    localStorage.setItem("scorex", scorex);
    score.textContent = "Player X: " + scorex;
  } else {
    scoreo++;
    localStorage.setItem("scoreo", scoreo);
    score2.textContent = "Player O: " + scoreo;
  }
}

function showDraw() {
  statustext.textContent = "Draw!";
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.style.color = "#ff0055"; 
    cell.style.textShadow = "0 0 10px #ff0055, 0 0 20px #ff5599";
  });}

function highlightWinningLine(result) {
  if (result.type === "row") {
    for (let j = 0; j < 3; j++) {
      const cell = document.querySelector(
        `.cell[data-row="${result.index}"][data-col="${j}"]`
      );
      cell.classList.add("win");
    }
  }

  if (result.type === "col") {
    for (let i = 0; i < 3; i++) {
      const cell = document.querySelector(
        `.cell[data-row="${i}"][data-col="${result.index}"]`
      );
      cell.classList.add("win");
    }
  }

  if (result.type === "diag" && result.index === 0) {
    for (let i = 0; i < 3; i++) {
      const cell = document.querySelector(
        `.cell[data-row="${i}"][data-col="${i}"]`
      );
      cell.classList.add("win");
    }
  }

  if (result.type === "diag" && result.index === 1) {
    for (let i = 0; i < 3; i++) {
      const cell = document.querySelector(
        `.cell[data-row="${i}"][data-col="${2 - i}"]`
      );
      cell.classList.add("win");
    }
  }
}

document.querySelectorAll(".cell").forEach((cell) =>
  cell.addEventListener("click", () =>
    handleclick(cell.dataset.row, cell.dataset.col)
  )
);

document.getElementById("reset").addEventListener("click", resetBoard);
document.getElementById("restart").addEventListener("click", restartBoard);

renderBoard();
