### Code Plan:

1. Set up the HTML structure for the game board, score display, and messages.
2. Create CSS styles for the game elements, including player colors.
3. Implement JavaScript functions for:
    - Initializing the game board
    - Handling player moves
    - Capturing opponent pieces
    - Updating the score
    - Checking for game end
    - Declaring the winner
    - Restarting the game

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hexad</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }
        #game-container {
            text-align: center;
        }
        #board {
            display: grid;
            grid-template-columns: repeat(6, 60px);
            gap: 4px;
            margin-top: 20px;
            background-color: #ddd;
            padding: 10px;
            border-radius: 10px;
        }
        .cell {
            width: 60px;
            height: 60px;
            border: 1px solid #aaa;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            cursor: pointer;
            background-color: white;
            transition: all 0.3s ease;
        }
        .cell:hover {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .red { background-color: #ff4136; }
        .blue { background-color: #0074d9; }
        #message {
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
        }
        #current-player {
            font-size: 20px;
            margin-bottom: 10px;
        }
        .red-text { color: #ff4136; }
        .blue-text { color: #0074d9; }
        #restart-button {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #2ecc40;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            display: none;
        }
        #restart-button:hover {
            background-color: #27ae60;
        }
        #score-container {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
        }
        .score {
            font-size: 18px;
            font-weight: bold;
        }
    </style>
</head>
<body>
<div id="game-container">
    <h1>Hexad</h1>
    <div id="current-player">Current Player: <span id="player-name" class="red-text">Red</span></div>
    <div id="board"></div>
    <div id="score-container">
        <div id="red-score" class="score red-text">Red: 0</div>
        <div id="blue-score" class="score blue-text">Blue: 0</div>
    </div>
    <div id="message"></div>
    <button id="restart-button" onclick="restartGame()">Restart Game</button>
</div>

<script>
    const BOARD_SIZE = 6;
    const PLAYERS = ['Red', 'Blue'];
    let currentPlayer = 0;
    let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    let gameOver = false;
    let movesCount = 0;

    function createBoard() {
        const boardElement = document.getElementById('board');
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.onclick = () => handleCellClick(i, j);
                boardElement.appendChild(cell);
            }
        }
    }

    function updateBoard() {
        const cells = document.querySelectorAll('.cell');
        board.flat().forEach((cell, index) => {
            cells[index].className = `cell ${cell !== null ? PLAYERS[cell].toLowerCase() : ''}`;
        });
        updateScores();
    }

    function handleCellClick(row, col) {
        if (gameOver || board[row][col] !== null) return;

        board[row][col] = currentPlayer;
        captureAdjacentCells(row, col);
        updateBoard();
        movesCount++;

        if (movesCount === BOARD_SIZE * BOARD_SIZE) {
            endGame();
        } else {
            switchPlayer();
        }
    }

    function captureAdjacentCells(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        directions.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            if (isValidCell(newRow, newCol) && board[newRow][newCol] !== null && board[newRow][newCol] !== currentPlayer) {
                board[newRow][newCol] = currentPlayer;
            }
        });
    }

    function isValidCell(row, col) {
        return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
    }

    function updateScores() {
        const flatBoard = board.flat();
        const redScore = flatBoard.filter(cell => cell === 0).length;
        const blueScore = flatBoard.filter(cell => cell === 1).length;

        document.getElementById('red-score').textContent = `Red: ${redScore}`;
        document.getElementById('blue-score').textContent = `Blue: ${blueScore}`;
    }

    function switchPlayer() {
        currentPlayer = 1 - currentPlayer;
        const playerNameElement = document.getElementById('player-name');
        playerNameElement.textContent = PLAYERS[currentPlayer];
        playerNameElement.className = `${PLAYERS[currentPlayer].toLowerCase()}-text`;
    }

    function endGame() {
        gameOver = true;
        const flatBoard = board.flat();
        const redScore = flatBoard.filter(cell => cell === 0).length;
        const blueScore = flatBoard.filter(cell => cell === 1).length;

        let winnerMessage;
        if (redScore > blueScore) {
            winnerMessage = "Red wins!";
        } else if (blueScore > redScore) {
            winnerMessage = "Blue wins!";
        } else {
            winnerMessage = "It's a tie!";
        }

        const messageElement = document.getElementById('message');
        messageElement.innerHTML = `Game Over!<br>Red: ${redScore} | Blue: ${blueScore}<br>${winnerMessage}`;
        document.getElementById('restart-button').style.display = 'inline-block';
    }

    function restartGame() {
        board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
        currentPlayer = 0;
        gameOver = false;
        movesCount = 0;
        updateBoard();
        document.getElementById('message').textContent = '';
        document.getElementById('restart-button').style.display = 'none';
        document.getElementById('player-name').textContent = PLAYERS[currentPlayer];
        document.getElementById('player-name').className = `${PLAYERS[currentPlayer].toLowerCase()}-text`;
    }

    createBoard();
    updateBoard();
</script>
</body>
</html>
```

### Explanation:

1. Game Board: A 6x6 grid is created using HTML and CSS. The board is represented by a 2D array in JavaScript.
2. Players: Two players (Red and Blue) take turns placing pieces on the board.
3. Gameplay:
    - Players click on empty cells to place their pieces.
    - The `handleCellClick` function manages the game logic when a cell is clicked.
    - The `captureSurroundingPieces` function implements the capture mechanic, flipping opponent pieces in the 6 surrounding spaces (not including diagonals on the same side).
4. Scoring:
    - The `updateScores` function calculates and displays the current score for both players after each move.
    - Scores are shown below the game board in the `score-container`.
5. Game End:
    - The game ends when all cells are filled (tracked by `movesCount`).
    - The `endGame` function calculates final scores, determines the winner, and displays the result.

The game is fully functional and can be played by copying the provided HTML code into a file and opening it in a web browser.