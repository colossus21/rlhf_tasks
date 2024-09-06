class TicTacToeBoard {
    constructor() {
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }

    makeMove(row, col, player) {
        if (row < 0 || row > 2 || col < 0 || col > 2) {
            throw new Error('Invalid move: Row and column must be between 0 and 2');
        }
        if (this.board[row][col] !== null) {
            throw new Error('Invalid move: Cell is already occupied');
        }
        if (player !== 'X' && player !== 'O') {
            throw new Error('Invalid player: Must be either "X" or "O"');
        }
        this.board[row][col] = player;
    }

    [Symbol.iterator]() {
        let row = 0;
        let col = 0;

        return {
            next: () => {
                if (row > 2) {
                    return { done: true };
                }

                const value = { row, col, value: this.board[row][col] };

                col++;
                if (col > 2) {
                    col = 0;
                    row++;
                }

                return { value, done: false };
            }
        };
    }
}

// Create a new Tic-Tac-Toe board
const board = new TicTacToeBoard();

// Make some moves
board.makeMove(0, 0, 'X');
board.makeMove(1, 1, 'O');
board.makeMove(2, 2, 'X');

// Iterate through all cells
for (const cell of board) {
    console.log(`Row: ${cell.row}, Col: ${cell.col}, Value: ${cell.value || 'Empty'}`);
}

// You can also use it with array methods that work with iterables
const cellArray = [...board];
console.log(cellArray);