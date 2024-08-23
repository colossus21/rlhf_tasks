class TicTacToeBoard {
    constructor() {
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }

    *[Symbol.iterator]() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                yield this.board[row][col];
            }
        }
    }

    placeMove(row, col, player) {
        if (row < 0 || row > 2 || col < 0 || col > 2) {
            return false; // Invalid move
        }
        if (this.board[row][col] === null) {
            this.board[row][col] = player;
            return true;
        }
        return false; // Cell already occupied
    }

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

    isFull() {
        for (let cell of this) {
            if (cell === null) return false;
        }
        return true;
    }

    reset() {
        this.board = this.board.map(row => row.map(() => null));
    }
}

function* gameGenerator() {
    const game = new TicTacToeBoard();
    const players = ['X', 'O'];
    let currentPlayerIndex = 0;

    while (!game.isFull()) {
        const currentPlayer = players[currentPlayerIndex];
        console.log(`\nPlayer ${currentPlayer}'s turn:`);

        // Yield control back to the caller, expecting a move
        const { row, col } = yield;

        if (game.placeMove(row, col, currentPlayer)) {
            console.log(`Player ${currentPlayer} placed at (${row}, ${col})`);
            game.displayBoard();

            // Switch to the next player
            currentPlayerIndex = (currentPlayerIndex + 1) % 2;
        } else {
            console.log("Invalid move! Try again.");
        }
    }

    console.log("Game Over! The board is full.");
}

// Function to simulate player moves
function simulateGame(gameIterator) {
    const moves = [
        {row: 0, col: 0}, {row: 1, col: 1}, // X, O
        {row: 0, col: 1}, {row: 2, col: 2}, // X, O
        {row: 0, col: 2}, {row: 1, col: 0}, // X, O
        {row: 2, col: 0}, {row: 1, col: 2}, // X, O
        {row: 2, col: 1}                    // X
    ];

    gameIterator.next(); // Start the game

    for (let move of moves) {
        console.log(`Making move: (${move.row}, ${move.col})`);
        gameIterator.next(move);
    }
}

// Run the game
const gameIterator = gameGenerator();
simulateGame(gameIterator);