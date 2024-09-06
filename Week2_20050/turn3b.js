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

    checkWinner() {
        // Check rows, columns and diagonals
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] && this.board[i][0] === this.board[i][1] && this.board[i][0] === this.board[i][2]) {
                return this.board[i][0]; // Row win
            }
            if (this.board[0][i] && this.board[0][i] === this.board[1][i] && this.board[0][i] === this.board[2][i]) {
                return this.board[0][i]; // Column win
            }
        }
        if (this.board[0][0] && this.board[0][0] === this.board[1][1] && this.board[0][0] === this.board[2][2]) {
            return this.board[0][0]; // Diagonal win
        }
        if (this.board[0][2] && this.board[0][2] === this.board[1][1] && this.board[0][2] === this.board[2][0]) {
            return this.board[0][2]; // Diagonal win
        }
        return null; // No winner
    }
}

function* gameGenerator() {
    const game = new TicTacToeBoard();
    const players = ['O', 'X']; // O starts first
    let currentPlayerIndex = 0;

    while (true) {
        const currentPlayer = players[currentPlayerIndex];
        console.log(`\nPlayer ${currentPlayer}'s turn:`);

        const { row, col } = yield;

        if (game.placeMove(row, col, currentPlayer)) {
            console.log(`Player ${currentPlayer} placed at (${row}, ${col})`);
            game.displayBoard();

            const winner = game.checkWinner();
            if (winner) {
                console.log(`Player ${winner} wins!`);
                return winner;
            }

            if (game.isFull()) {
                console.log("It's a draw!");
                return 'draw';
            }

            currentPlayerIndex = (currentPlayerIndex + 1) % 2;
        } else {
            console.log("Invalid move! Try again.");
        }
    }
}

function simulateGame(gameIterator) {
    const moves = [
        {row: 0, col: 0}, // O
        {row: 1, col: 1}, // X
        {row: 0, col: 1}, // O
        {row: 0, col: 2}, // X
        {row: 2, col: 0}, // O
        {row: 2, col: 2}  // X (winning move)
    ];

    gameIterator.next(); // Start the game

    for (let move of moves) {
        console.log(`Making move: (${move.row}, ${move.col})`);
        const result = gameIterator.next(move);
        if (result.done) {
            console.log(`Game ended. Result: ${result.value}`);
            break;
        }
    }
}

// Run the game
const gameIterator = gameGenerator();
simulateGame(gameIterator);