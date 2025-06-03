document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".cell");
  const resetBtn = document.getElementById("reset");
  let board = Array(9).fill(0);
  let model;

  async function loadModel() {
    model = await tf.loadLayersModel("model/ttt_model.json");
  }

  function playMove(index, player) {
    if (board[index] === 0) {
      board[index] = player;
      cells[index].textContent = player === 1 ? "X" : "O";
      cells[index].classList.add(player === 1 ? "x" : "o");
    }
    checkWinner();
  }

  function aiMove() {
    const inputTensor = tf.tensor([board]);
    const prediction = model.predict(inputTensor).argMax(1).dataSync()[0];
    playMove(prediction, -1);
  }

  function checkWinner() {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Horizontal
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Vertical
      [0, 4, 8],
      [2, 4, 6], // Diagonal
    ];
    wins.forEach((combo) => {
      const [a, b, c] = combo;
      if (board[a] !== 0 && board[a] === board[b] && board[a] === board[c]) {
        alert(`Ganador: ${board[a] === 1 ? "X" : "O"}`);
        resetGame();
      }
    });
  }

  function resetGame() {
    board.fill(0);
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("x", "o");
    });
  }

  resetBtn.addEventListener("click", resetGame);
  cells.forEach((cell, i) => {
    cell.addEventListener("click", () => {
      if (board[i] === 0) {
        playMove(i, 1);
        setTimeout(aiMove, 500);
      }
    });
  });

  loadModel();
});
