import sqlite3


def init_database():
    try:
        with sqlite3.connect("scores.db") as conn:
            cursor = conn.cursor()

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS scores (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    player_name TEXT NOT NULL,
                    difficulty TEXT NOT NULL,
                    time_taken INTEGER NOT NULL
                )
            """)

            conn.commit()

        print("Database initialized successfully.")

    except sqlite3.Error as e:
        print("Database error:", e)


if __name__ == "__main__":
    init_database()