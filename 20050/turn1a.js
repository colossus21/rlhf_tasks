class TicTacToeBoard {
    constructor() {
        // Initialize a 3x3 board with null values
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }

    // Custom iterator for the board
    *[Symbol.iterator]() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                yield this.board[row][col];
            }
        }
    }

    // Method to place a move
    placeMove(row, col, player) {
        if (this.board[row][col] === null) {
            this.board[row][col] = player;
            return true;
        }
        return false; // Cell already occupied
    }

    // Method to display the board
    displayBoard() {
        let display = '';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let cell = this.board[i][j];
                display += (cell === null ? ' ' : cell) + (j < 2 ? ' | ' : '');
            }
            if (i < 2) display += '\n---------\n';
        }
        console.log(display);
    }

    // Check if the board is full
    isFull() {
        for (let cell of this) {
            if (cell === null) return false;
        }
        return true;
    }

    // Reset the board
    reset() {
        this.board = this.board.map(row => row.map(() => null));
    }
}

// Example usage:
const game = new TicTacToeBoard();

// Make some moves
game.placeMove(0, 0, 'X');
game.placeMove(1, 1, 'O');
game.placeMove(0, 2, 'X');

// Display the board
game.displayBoard();

// Use the custom iterator
for (let cell of game) {
    console.log(cell); // This will log each cell's content
}

// Check if board is full
console.log("Is the board full?", game.isFull());

// Reset the game
game.reset();
console.log("Board after reset:");
game.displayBoard();