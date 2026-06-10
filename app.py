from flask import Flask, render_template, request, jsonify
import sqlite3
from sudoku import SudokuGenerator

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/new_game")
def new_game():
    difficulty = request.args.get("difficulty", "easy")

    generator = SudokuGenerator()
    puzzle, solution = generator.generate(difficulty)

    return jsonify({
        "puzzle": puzzle,
        "solution": solution
    })


@app.route("/save_score", methods=["POST"])
def save_score():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data received"}), 400

    player = data.get("player", "").strip()
    difficulty = data.get("difficulty", "easy")
    time_taken = data.get("time")

    if not player:
        return jsonify({"error": "Player name required"}), 400

    try:
        with sqlite3.connect("scores.db") as conn:
            cursor = conn.cursor()

            cursor.execute("""
                INSERT INTO scores
                (player_name, difficulty, time_taken)
                VALUES (?, ?, ?)
            """, (player, difficulty, time_taken))

            conn.commit()

        return jsonify({"message": "Score saved"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/leaderboard")
def leaderboard():
    try:
        with sqlite3.connect("scores.db") as conn:
            cursor = conn.cursor()

            cursor.execute("""
                SELECT player_name,
                       difficulty,
                       time_taken
                FROM scores
                ORDER BY time_taken ASC
                LIMIT 10
            """)

            scores = cursor.fetchall()

        return jsonify(scores)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)