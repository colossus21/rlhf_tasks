### Code Plan:

- Set up HTML structure (title, message area, game board, restart button).
- Style with CSS (centered grid, animations, visual enhancements).
- Implement game logic in JavaScript (board creation, ship placement, gameplay).
- Add animations and visual feedback.
- Create placement guide and turn indicators.

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini Battleship</title>
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
            display: flex;
            flex-direction: column;
        }
        #board {
            display: inline-grid;
            grid-template-columns: repeat(6, 60px);
            grid-template-rows: repeat(6, 60px);
            gap: 2px;
            margin: 20px;
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
            transition: all 0.3s ease;
        }
        .cell:hover {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .player-area {
            background-color: rgba(255, 0, 0, 0.1);
        }
        .cpu-area {
            background-color: rgba(0, 0, 255, 0.1);
        }
        .ship {
            font-size: 40px;
        }
        .miss {
            color: gray;
        }
        .hit-player {
            background-color: rgba(255, 0, 0, 0.3);
        }
        .hit-cpu {
            background-color: rgba(0, 0, 255, 0.3);
        }
        #message {
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
        }
        #restart-button {
            margin-top: 20px;
            margin-left: auto;
            margin-right: auto;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #1685bf;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            max-width: 200px;
        }
        #restart-button:hover {
            background-color: #27ae60;
        }
    </style>
</head>
<body>
<div id="game-container">
    <h1>Mini Battleship</h1>
    <div id="message"></div>
    <div id="board"></div>
    <button id="restart-button" onclick="restartGame()">Restart Game</button>
</div>

<script>
    const BOARD_SIZE = 6;
    const PLAYER_ROWS = 3;
    const SHIPS = ['▲', '■', '●', '★'];
    let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    let playerShipsPlaced = 0;
    let cpuShipsPlaced = 0;
    let gamePhase = 'placement';
    let currentShip = 0;

    function createBoard() {
        const boardElement = document.getElementById('board');
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = `cell ${i < PLAYER_ROWS ? 'player-area' : 'cpu-area'}`;
                cell.onclick = () => handleCellClick(i, j);
                boardElement.appendChild(cell);
            }
        }
    }

    function updateBoard() {
        const cells = document.getElementById('board').children;
        board.flat().forEach((cell, index) => {
            const cellElement = cells[index];
            cellElement.innerHTML = '';
            if (cell === 'X') {
                cellElement.innerHTML = '❌';
                cellElement.classList.add('miss');
            } else if (typeof cell === 'string' && SHIPS.includes(cell)) {
                if (index < PLAYER_ROWS * BOARD_SIZE || gamePhase === 'gameover') {
                    cellElement.innerHTML = `<span class="ship">${cell}</span>`;
                }
                if (cellElement.classList.contains('hit-player') || cellElement.classList.contains('hit-cpu')) {
                    cellElement.innerHTML = `<span class="ship">${cell}</span>`;
                }
            }
        });
    }

    function handleCellClick(row, col) {
        if (gamePhase === 'placement' && row < PLAYER_ROWS) {
            placePlayerShip(row, col);
        } else if (gamePhase === 'attack' && row >= PLAYER_ROWS) {
            attackCPU(row, col);
        }
    }

    function placePlayerShip(row, col) {
        if (board[row][col] === null) {
            board[row][col] = SHIPS[currentShip];
            playerShipsPlaced++;
            currentShip++;
            updateBoard();

            if (playerShipsPlaced === SHIPS.length) {
                placeCPUShips();
                gamePhase = 'attack';
                showMessage("All ships placed. Start attacking the CPU's area!");
            } else {
                showMessage(`Place your ${SHIPS[currentShip]} ship.`);
            }
        }
    }

    function placeCPUShips() {
        for (let ship of SHIPS) {
            let placed = false;
            while (!placed) {
                const row = Math.floor(Math.random() * PLAYER_ROWS) + PLAYER_ROWS;
                const col = Math.floor(Math.random() * BOARD_SIZE);
                if (board[row][col] === null) {
                    board[row][col] = ship;
                    placed = true;
                    cpuShipsPlaced++;
                }
            }
        }
        updateBoard();
    }

    function attackCPU(row, col) {
        if (gamePhase !== 'attack' || board[row][col] === 'X') return;

        if (board[row][col] === null) {
            board[row][col] = 'X';
            showMessage("You missed!");
        } else {
            showMessage(`You hit a ${board[row][col]}!`);
            document.getElementById('board').children[row * BOARD_SIZE + col].classList.add('hit-cpu');
            cpuShipsPlaced--;
        }

        updateBoard();

        if (cpuShipsPlaced === 0) {
            endGame('player');
        } else {
            setTimeout(cpuAttack, 1000);
        }
    }

    function cpuAttack() {
        let row, col;
        do {
            row = Math.floor(Math.random() * PLAYER_ROWS);
            col = Math.floor(Math.random() * BOARD_SIZE);
        } while (board[row][col] === 'X' ||
        document.getElementById('board').children[row * BOARD_SIZE + col].classList.contains('hit-player'));

        if (board[row][col] === null) {
            board[row][col] = 'X';
            showMessage("CPU missed!");
        } else {
            showMessage(`CPU hit your ${board[row][col]}!`);
            document.getElementById('board').children[row * BOARD_SIZE + col].classList.add('hit-player');
            playerShipsPlaced--;
        }

        updateBoard();

        if (playerShipsPlaced === 0) {
            endGame('cpu');
        }
    }

    function endGame(winner) {
        gamePhase = 'gameover';
        showMessage(winner === 'player' ? "Congratulations! You won!" : "CPU won. Better luck next time!");
        updateBoard();
    }

    function showMessage(msg) {
        document.getElementById('message').textContent = msg;
    }

    function restartGame() {
        board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
        playerShipsPlaced = 0;
        cpuShipsPlaced = 0;
        gamePhase = 'placement';
        currentShip = 0;
        updateBoard();
        showMessage(`Place your ${SHIPS[currentShip]} ship.`);

        // Reset hit classes
        const cells = document.getElementById('board').children;
        for (let cell of cells) {
            cell.classList.remove('hit-player', 'hit-cpu', 'miss');
        }
    }

    createBoard();
    showMessage(`Place your ${SHIPS[currentShip]} ship.`);
</script>
</body>
</html>
```

### Explanation:

- A 6x6 grid split into player (top) and CPU (bottom) areas.
- The player play in two phases: ship placement and attacking. 
- The player places four ship types: triangle, square, circle and star in the placement phase.
- Turn-based gameplay with the player and CPU alternating is played in the second phase. Each player tries to destroy each other's ship.
- Animations for hits, misses, and ship placement are added.
- Placement guide for player during setup is added. We have also centered the grid with color-coded areas.
- Game messages display turn information and results.
- A restart button is added for new games.

This implementation creates an engaging Mini Battleship game with a shared-grid twist and appealing visuals.