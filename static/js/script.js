let puzzle = [];
let solution = [];

let seconds = 0;
let timerInterval = null;

const board = document.getElementById("sudoku-board");

/* ---------------- TIMER ---------------- */
function startTimer() {
    clearInterval(timerInterval);

    seconds = 0;

    timerInterval = setInterval(() => {
        seconds++;

        const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");

        document.getElementById("timer").textContent =
            `${mins}:${secs}`;
    }, 1000);
}

/* ---------------- NEW GAME ---------------- */
async function newGame() {
    const difficulty = document.getElementById("difficulty").value;

    const response = await fetch(`/new_game?difficulty=${difficulty}`);
    const data = await response.json();

    puzzle = data.puzzle;
    solution = data.solution;

    document.getElementById("status").textContent = "Playing";

    renderBoard();
    startTimer();
}

/* ---------------- RENDER BOARD ---------------- */
function renderBoard() {
    board.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {

            const input = document.createElement("input");
            input.className = "cell";
            input.type = "text";
            input.maxLength = 1;
            input.inputMode = "numeric";

            input.dataset.row = i;
            input.dataset.col = j;

            if (puzzle[i][j] !== 0) {
                input.value = puzzle[i][j];
                input.disabled = true;

                input.style.background = "#e5e7eb";
                input.style.fontWeight = "bold";
            } else {
                input.addEventListener("input", validateInput);
            }

            board.appendChild(input);
        }
    }
}

/* ---------------- VALIDATION ---------------- */
function validateInput(event) {
    const input = event.target;

    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);

    if (input.value === "") return;

    const value = parseInt(input.value);

    if (isNaN(value) || value < 1 || value > 9) {
        input.value = "";
        return;
    }

    if (value === solution[row][col]) {
        puzzle[row][col] = value;

        input.disabled = true;
        input.style.background = "#d1fae5";
        input.style.color = "#065f46";

        checkWin();
    } else {
        input.style.background = "#fecaca";

        setTimeout(() => {
            input.style.background = "";
        }, 400);

        input.value = "";
    }
}

/* ---------------- WIN CHECK ---------------- */
function checkWin() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (puzzle[i][j] !== solution[i][j]) return;
        }
    }

    clearInterval(timerInterval);

    document.getElementById("status").textContent = "Completed";

    alert("🎉 Congratulations! You solved it!");

    saveScore();
}

/* ---------------- SAVE SCORE (FIXED) ---------------- */
async function saveScore() {
    const player = prompt("Enter your name:");

    if (!player) return;

    const difficulty = document.getElementById("difficulty").value;

    try {
        await fetch("/save_score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                player,
                difficulty,
                time: seconds
            })
        });

        await loadLeaderboard(); // ✅ IMPORTANT FIX

    } catch (err) {
        console.error(err);
    }
}

/* ---------------- LEADERBOARD (FIXED) ---------------- */
async function loadLeaderboard() {
    try {
        const response = await fetch("/leaderboard");
        const scores = await response.json();

        const tbody = document.getElementById("leaderboard-body");

        tbody.innerHTML = "";

        if (!scores.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3">No scores available</td>
                </tr>
            `;
            return;
        }

        scores.forEach(score => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${score[0]}</td>
                <td>${score[1]}</td>
                <td>${score[2]} sec</td>
            `;

            tbody.appendChild(row);
        });

    } catch (err) {
        console.error(err);
    }
}

/* ---------------- HINT ---------------- */
function giveHint() {
    const inputs = document.querySelectorAll(".cell");

    for (const input of inputs) {
        if (!input.disabled && input.value === "") {

            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);

            input.value = solution[row][col];
            input.disabled = true;

            input.style.background = "#d1fae5";

            puzzle[row][col] = solution[row][col];

            checkWin();
            return;
        }
    }

    alert("No hints available.");
}

/* ---------------- THEME ---------------- */
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

/* ---------------- EVENTS ---------------- */
document.getElementById("new-game-btn").addEventListener("click", newGame);
document.getElementById("hint-btn").addEventListener("click", giveHint);
document.getElementById("theme-btn").addEventListener("click", toggleTheme);

/* ---------------- INIT ---------------- */
loadLeaderboard();
newGame();