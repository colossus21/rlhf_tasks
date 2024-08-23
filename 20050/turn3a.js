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
        if (row < 0 || row > 2 || col < 0 || col > 2) return false;
        if (this.board[row][col] === null) {
            this.board[row][col] = player;
            return true;
        }
        return false;
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
        return [...this].every(cell => cell !== null);
    }

    // Check if there's a winner
    checkWinner() {
        const lines = [
            // Rows
            [[0,0], [0,1], [0,2]],
            [[1,0], [1,1], [1,2]],
            [[2,0], [2,1], [2,2]],
            // Columns
            [[0,0], [1,0], [2,0]],
            [[0,1], [1,1], [2,1]],
            [[0,2], [1,2], [2,2]],
            // Diagonals
            [[0,0], [1,1], [2,2]],
            [[0,2], [1,1], [2,0]]
        ];

        for (let line of lines) {
            const [a, b, c] = line;
            if (this.board[a[0]][a[1]] &&
                this.board[a[0]][a[1]] === this.board[b[0]][b[1]] &&
                this.board[a[0]][a[1]] === this.board[c[0]][c[1]]) {
                return this.board[a[0]][a[1]]; // Return the winner 'X' or 'O'
            }
        }
        return null; // No winner
    }

    // Check if the game is drawn
    isDraw() {
        return this.isFull() && !this.checkWinner();
    }

    reset() {
        this.board = this.board.map(row => row.map(() => null));
    }
}

function* gameGenerator() {
    const game = new TicTacToeBoard();
    const players = ['X', 'O'];
    let currentPlayerIndex = 0;
    let moves = 0;

    while (moves < 9) {
        const currentPlayer = players[currentPlayerIndex];
        console.log(`\nPlayer ${currentPlayer}'s turn:`);

        const { row, col } = yield;
        if (game.placeMove(row, col, currentPlayer)) {
            game.displayBoard();
            moves++;

            if (game.checkWinner()) {
                console.log(`Player ${currentPlayer} wins!`);
                return;
            } else if (game.isDraw()) {
                console.log("It's a draw!");
                return;
            }

            currentPlayerIndex = (currentPlayerIndex + 1) % 2;
        } else {
            console.log("Invalid move! Try again.");
        }
    }
}

function simulateGame(gameIterator) {
    const moves = [
        {row: 1, col: 1}, // O starts in the center
        {row: 0, col: 0}, // X takes a corner
        {row: 0, col: 1},
        {row: 2, col: 2},
        {row: 0, col: 2},
        {row: 1, col: 0}, // X sets up for win
        {row: 2, col: 0},
        {row: 1, col: 2}  // X wins with this move
    ];

    let result = gameIterator.next();
    for (let move of moves) {
        console.log(`Making move: (${move.row}, ${move.col})`);
        result = gameIterator.next(move);
    }
}

// Run the game
const gameIterator = gameGenerator();
simulateGame(gameIterator);