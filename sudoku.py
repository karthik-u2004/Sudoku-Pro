import random
import copy


class SudokuGenerator:
    def __init__(self):
        self.board = []

    def generate(self, difficulty="easy"):
        # Reset board for every new game
        self.board = [[0 for _ in range(9)] for _ in range(9)]

        # Generate a complete Sudoku solution
        self.fill_board()

        solution = copy.deepcopy(self.board)
        puzzle = copy.deepcopy(self.board)

        # Difficulty levels
        difficulty = difficulty.lower()

        if difficulty == "easy":
            removals = 35
        elif difficulty == "medium":
            removals = 45
        elif difficulty == "hard":
            removals = 55
        else:
            removals = 35

        # Remove numbers to create the puzzle
        while removals > 0:
            row = random.randint(0, 8)
            col = random.randint(0, 8)

            if puzzle[row][col] != 0:
                puzzle[row][col] = 0
                removals -= 1

        return puzzle, solution

    def fill_board(self):
        return self.solve(self.board)

    def solve(self, board):
        empty = self.find_empty(board)

        if empty is None:
            return True

        row, col = empty

        nums = list(range(1, 10))
        random.shuffle(nums)

        for num in nums:
            if self.valid(board, num, (row, col)):
                board[row][col] = num

                if self.solve(board):
                    return True

                board[row][col] = 0

        return False

    def find_empty(self, board):
        for row in range(9):
            for col in range(9):
                if board[row][col] == 0:
                    return row, col

        return None

    def valid(self, board, num, pos):
        row, col = pos

        # Check row
        for i in range(9):
            if board[row][i] == num and i != col:
                return False

        # Check column
        for i in range(9):
            if board[i][col] == num and i != row:
                return False

        # Check 3×3 box
        box_row = (row // 3) * 3
        box_col = (col // 3) * 3

        for i in range(box_row, box_row + 3):
            for j in range(box_col, box_col + 3):
                if board[i][j] == num and (i, j) != pos:
                    return False

        return True