class TicTacToeBoard {
    constructor() {
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
                yield [row, col, this.board[row][col]];
            }
        }
    }

    // Place a move on the board
    placeMove(row, col, player) {
        if (row < 0 || row > 2 || col < 0 || col > 2 || this.board[row][col] !== null) {
            return false;
        }
        this.board[row][col] = player;
        return true;
    }

    // Display the current state of the board
    displayBoard() {
        console.log('Current Board:');
        for (let i = 0; i < 3; i++) {
            console.log(this.board[i].map(cell => cell === null ? ' ' : cell).join(' | '));
            if (i < 2) console.log('---------');
        }
    }

    // Check if the game has a winner or it's a draw
    checkWinner() {
        // Check rows, columns, and diagonals
        const lines = [
            ...this.board, // rows
            ...this.board[0].map((_, colIndex) => this.board.map(row => row[colIndex])), // columns
            [this.board[0][0], this.board[1][1], this.board[2][2]], // diagonal
            [this.board[0][2], this.board[1][1], this.board[2][0]]  // anti-diagonal
        ];

        for (let line of lines) {
            if (line.every(cell => cell === 'X')) return 'X';
            if (line.every(cell => cell === 'O')) return 'O';
        }

        // Check for draw
        if ([...this].every(cell => cell[2] !== null)) {
            return 'Draw';
        }

        return null; // No winner yet
    }
}

function* gameTurns() {
    const board = new TicTacToeBoard();
    let player = 'X';

    while (true) {
        board.displayBoard();
        let row, col;

        // This is a simple prompt for input. In a real game, you'd handle this differently.
        do {
            row = parseInt(prompt(`Player ${player}, enter row (0-2):`));
            col = parseInt(prompt(`Player ${player}, enter column (0-2):`));
        } while (!board.placeMove(row, col, player));

        const result = board.checkWinner();
        if (result) {
            board.displayBoard();
            if (result === 'Draw') {
                console.log("It's a draw!");
            } else {
                console.log(`Player ${result} wins!`);
            }
            return;
        }

        // Switch player
        player = player === 'X' ? 'O' : 'X';
        yield; // Pause here to simulate turn-based gameplay
    }
}

// Run the game
const game = gameTurns();
let result = game.next();

// In a Node.js environment, you might need to simulate turns manually
// since there's no prompt function. Here's how you could automate turns:
function simulateGame() {
    const moves = [
        [0,0], [0,1],
        [1,1], [1,0],
        [2,2], [0,2],
        [2,0], [1,2],
        [2,1]
    ];

    for (let move of moves) {
        result = game.next();
        if (result.done) break;
        board.placeMove(...move, result.value || 'X'); // Use result.value to determine player if needed
    }
}

simulateGame();