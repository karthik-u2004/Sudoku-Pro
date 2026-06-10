import sqlite3

conn = sqlite3.connect("scores.db")
cursor = conn.cursor()

cursor.execute("SELECT * FROM scores")
rows = cursor.fetchall()

print("TOTAL ROWS:", len(rows))
print(rows)

conn.close()