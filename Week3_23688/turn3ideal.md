Certainly! I've made the requested improvements and fixed the issue with the big winning lines. Here's the updated and complete HTML file with all the new features:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wild Tic-Tac-Toe (9x9)</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
        }
        .game-container {
            position: relative;
        }
        .game-board {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 10px;
            background-color: #000;
            padding: 10px;
        }
        .sub-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 2px;
            background-color: #000;
            position: relative;
        }
        .cell {
            width: 50px;
            height: 50px;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
        }
        .win-line {
            position: absolute;
            z-index: 2;
        }
        .huge-symbol {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 100px;
            font-weight: bold;
            background-color: rgba(255, 255, 255, 0.8);
            z-index: 2;
        }
        .X {
            color: red;
        }
        .O {
            color: blue;
        }
        #restartButton {
            margin-bottom: 10px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
        }
        #turnIndicator {
            position: absolute;
            top: -40px;
            right: 0;
            font-size: 18px;
            font-weight: bold;
        }
        #winMessage {
            margin-top: 20px;
            font-size: 24px;
            font-weight: bold;
        }
    </style>
</head>
<body>
<button id="restartButton">Restart Game</button>
<div class="game-container">
    <div id="turnIndicator"></div>
    <div class="game-board" id="gameBoard"></div>
</div>
<div id="winMessage"></div>

<script>
    const gameBoard = document.getElementById('gameBoard');
    const restartButton = document.getElementById('restartButton');
    const turnIndicator = document.getElementById('turnIndicator');
    const winMessage = document.getElementById('winMessage');
    let currentPlayer = 'O';
    let subGridWins = new Array(9).fill(null);
    let gameEnded = false;

    function initializeGame() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const subGrid = document.createElement('div');
            subGrid.classList.add('sub-grid');
            subGrid.dataset.index = i;
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = Math.floor(j / 3);
                cell.dataset.col = j % 3;
                cell.addEventListener('click', handleCellClick);
                subGrid.appendChild(cell);
            }
            gameBoard.appendChild(subGrid);
        }
        currentPlayer = 'O';
        subGridWins = new Array(9).fill(null);
        gameEnded = false;
        updateTurnIndicator();
        winMessage.textContent = '';
    }

    function handleCellClick(event) {
        if (gameEnded) return;
        const cell = event.target;
        const subGrid = cell.parentElement;
        if (cell.textContent === '' && !subGridWins[subGrid.dataset.index]) {
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer);
            if (checkSubGridWin(subGrid)) {
                subGridWins[subGrid.dataset.index] = currentPlayer;
                replaceSubGridWithSymbol(subGrid, currentPlayer);
                if (checkMainGridWin()) {
                    endGame(`Player ${currentPlayer} wins the game!`);
                    return;
                }
            }
            currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
            updateTurnIndicator();
        }
    }

    function checkSubGridWin(subGrid) {
        const cells = subGrid.children;
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
            [0, 4, 8], [2, 4, 6] // Diagonal
        ];

        for (const line of lines) {
            if (cells[line[0]].textContent === currentPlayer &&
                    cells[line[1]].textContent === currentPlayer &&
                    cells[line[2]].textContent === currentPlayer) {
                drawWinLine(subGrid, line);
                return true;
            }
        }
        return false;
    }

    function drawWinLine(subGrid, line) {
        const winLine = document.createElement('div');
        winLine.classList.add('win-line');
        winLine.classList.add(currentPlayer);

        const startCell = subGrid.children[line[0]];
        const endCell = subGrid.children[line[2]];
        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();
        const subGridRect = subGrid.getBoundingClientRect();

        const x1 = startRect.left + startRect.width / 2 - subGridRect.left;
        const y1 = startRect.top + startRect.height / 2 - subGridRect.top;
        const x2 = endRect.left + endRect.width / 2 - subGridRect.left;
        const y2 = endRect.top + endRect.height / 2 - subGridRect.top;

        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        winLine.style.width = `${length}px`;
        winLine.style.height = '2px';
        winLine.style.backgroundColor = currentPlayer === 'X' ? 'red' : 'blue';
        winLine.style.position = 'absolute';
        winLine.style.top = `${y1}px`;
        winLine.style.left = `${x1}px`;
        winLine.style.transform = `rotate(${angle}deg)`;
        winLine.style.transformOrigin = 'left center';

        subGrid.appendChild(winLine);
    }

    function replaceSubGridWithSymbol(subGrid, symbol) {
        const hugeSymbol = document.createElement('div');
        hugeSymbol.classList.add('huge-symbol', symbol);
        hugeSymbol.textContent = symbol;
        subGrid.appendChild(hugeSymbol);
    }

    function checkMainGridWin() {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
            [0, 4, 8], [2, 4, 6] // Diagonal
        ];

        for (const line of lines) {
            if (subGridWins[line[0]] &&
                    subGridWins[line[0]] === subGridWins[line[1]] &&
                    subGridWins[line[0]] === subGridWins[line[2]]) {
                drawMainWinLine(line);
                return true;
            }
        }
        return false;
    }

    function drawMainWinLine(line) {
        const winLine = document.createElement('div');
        winLine.classList.add('win-line');
        winLine.classList.add(currentPlayer);

        const startSubGrid = gameBoard.children[line[0]];
        const endSubGrid = gameBoard.children[line[2]];
        const startRect = startSubGrid.getBoundingClientRect();
        const endRect = endSubGrid.getBoundingClientRect();
        const gameBoardRect = gameBoard.getBoundingClientRect();

        const x1 = startRect.left + startRect.width / 2 - gameBoardRect.left;
        const y1 = startRect.top + startRect.height / 2 - gameBoardRect.top;
        const x2 = endRect.left + endRect.width / 2 - gameBoardRect.left;
        const y2 = endRect.top + endRect.height / 2 - gameBoardRect.top;

        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        winLine.style.width = `${length}px`;
        winLine.style.height = '10px';
        winLine.style.backgroundColor = currentPlayer === 'X' ? 'red' : 'blue';
        winLine.style.position = 'absolute';
        winLine.style.top = `${y1}px`;
        winLine.style.left = `${x1}px`;
        winLine.style.transform = `rotate(${angle}deg)`;
        winLine.style.transformOrigin = 'left center';

        gameBoard.appendChild(winLine);
    }

    function endGame(message) {
        gameEnded = true;
        winMessage.textContent = message;
        turnIndicator.textContent = '';
    }

    function updateTurnIndicator() {
        turnIndicator.textContent = `Player ${currentPlayer}, your turn!`;
        turnIndicator.style.color = currentPlayer === 'X' ? 'red' : 'blue';
    }

    restartButton.addEventListener('click', initializeGame);

    initializeGame();
</script>
</body>
</html>
```

Here are the improvements and new features implemented:

1. Fixed the issue with big winning lines: The lines are now drawn within the game board.
2. Added a win message below the tic-tac-toe box instead of showing an alert.
3. Implemented a restart game button above the box.
4. Once the game completes, only the restart button is clickable, and no moves can be added to the game.
5. Added a turn indicator message in the top-right corner above the box.
6. The game now initializes properly and can be restarted at any time.

These changes create a more user-friendly and interactive game experience. The game now has clear indications of whose turn it is, when the game ends, and how to restart it.

To play the game:

1. Save this code as an HTML file.
2. Open it in a web browser.
3. Players can click on empty cells to place their symbols.
4. The game will automatically detect wins in each 3x3 sub-grid and the overall 9x9 grid.
5. When the game ends, a message will be displayed below the board.
6. Click the "Restart Game" button to start a new game at any time.

Enjoy your improved Wild Tic-Tac-Toe game!