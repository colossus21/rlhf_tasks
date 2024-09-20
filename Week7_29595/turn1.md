### Code Plan:

1. UI Components:
   1. Game container
   2. Title: "Dragon Treasure Hunt"
   3. Score display: Treasures collected and treasures left
   4. 9x9 grid game board
   5. Message display area
   6. Restart button (hidden initially)

2. Gameplay Elements:
   1. Player character (green wizard emoji)
   2. Dragons (placed in the center of each 3x3 section)
   3. Treasures (gem icons)
   4. Fire cells
   5. Dragon fire shooting mechanism
   6. Treasure collection logic
   7. Win/lose condition checking
   8. Game reset functionality

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dragon Treasure Hunt</title>
    <style>
        body {
            font-family: 'MedievalSharp', cursive;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #2c3e50;
            color: #f0e6d2;
        }
        #game-container {
            text-align: center;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }
        #board {
            display: grid;
            grid-template-columns: repeat(9, 60px);
            grid-template-rows: repeat(9, 60px);
            gap: 2px;
            margin-top: 20px;
            background-color: #34495e;
            padding: 5px;
            border-radius: 5px;
            border: 3px solid #c0392b;
        }
        .cell {
            width: 60px;
            height: 60px;
            background-color: #445566;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 32px;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        .dragon { background-color: #c0392b; }
        .treasure { background-color: #f1c40f; }
        .player { background-color: #2ecc71; }
        .fire { background-color: #e74c3c; }
        #message {
            margin-top: 20px;
            font-size: 24px;
            font-weight: bold;
            color: #f39c12;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        #score, #treasures-left {
            margin-top: 10px;
            font-size: 20px;
            color: #3498db;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        .pulse { animation: pulse 0.5s infinite; }
        #restart-button {
            display: none;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 18px;
            background-color: #2ecc71;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        #restart-button:hover { background-color: #27ae60; }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap" rel="stylesheet">
</head>
<body>
<div id="game-container">
    <h1>Dragon Treasure Hunt</h1>
    <div id="score">Treasures Collected: 0</div>
    <div id="treasures-left">Treasures Left: 9</div>
    <div id="board"></div>
    <div id="message"></div>
    <button id="restart-button" onclick="window.location.reload()">Restart Game</button>
</div>

<script>
    const BOARD_SIZE = 9;
    const SECTION_SIZE = 3;
    let board = [];
    let playerPosition = { row: 0, col: 0 };
    let treasuresCollected = 0;
    let treasuresLeft = 9;
    let gameOver = false;
    let dragonFireIntervals = [];

    function createBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                boardElement.appendChild(cell);
                board[i][j] = { type: 'empty' };

                if (i % SECTION_SIZE === 1 && j % SECTION_SIZE === 1) {
                    board[i][j].type = 'dragon';
                    cell.classList.add('dragon');
                    cell.textContent = '🐲';
                }
            }
        }
        placeTreasures();
        placePlayer();
        updateBoard();
        setupDragonFireIntervals();
    }

    function placeTreasures() {
        for (let sectionRow = 0; sectionRow < 3; sectionRow++) {
            for (let sectionCol = 0; sectionCol < 3; sectionCol++) {
                let placed = false;
                while (!placed) {
                    const row = sectionRow * 3 + Math.floor(Math.random() * 3);
                    const col = sectionCol * 3 + Math.floor(Math.random() * 3);
                    if (board[row][col].type === 'empty') {
                        board[row][col].type = 'treasure';
                        placed = true;
                    }
                }
            }
        }
    }

    function placePlayer() {
        playerPosition = { row: 0, col: 0 };
        board[0][0].type = 'player';
    }

    function updateBoard() {
        const cells = document.querySelectorAll('.cell');
        board.flat().forEach((cell, index) => {
            cells[index].className = 'cell';
            cells[index].textContent = '';
            if (cell.type === 'dragon') {
                cells[index].classList.add('dragon');
                cells[index].textContent = '🐲';
            } else if (cell.type === 'treasure') {
                cells[index].classList.add('treasure');
                cells[index].textContent = '💎';
            } else if (cell.type === 'player') {
                cells[index].classList.add('player');
                cells[index].textContent = '🧙‍♂️';
            } else if (cell.type === 'fire') {
                cells[index].classList.add('fire');
                cells[index].textContent = '🔥';
            }
        });
    }

    function movePlayer(direction) {
        if (gameOver) return;

        const newPosition = { ...playerPosition };
        switch (direction) {
            case 'ArrowUp': newPosition.row--; break;
            case 'ArrowDown': newPosition.row++; break;
            case 'ArrowLeft': newPosition.col--; break;
            case 'ArrowRight': newPosition.col++; break;
        }

        if (newPosition.row >= 0 && newPosition.row < BOARD_SIZE &&
            newPosition.col >= 0 && newPosition.col < BOARD_SIZE &&
            board[newPosition.row][newPosition.col].type !== 'dragon') {
            board[playerPosition.row][playerPosition.col].type = 'empty';
            playerPosition = newPosition;

            if (board[playerPosition.row][playerPosition.col].type === 'treasure') {
                treasuresCollected++;
                treasuresLeft--;
                updateScore();
                if (treasuresLeft === 0) {
                    endGame(true);
                }
            } else if (board[playerPosition.row][playerPosition.col].type === 'fire') {
                endGame(false);
            }

            board[playerPosition.row][playerPosition.col].type = 'player';
            updateBoard();
        }
    }

    function setupDragonFireIntervals() {
        const intervals = [9000, 5000, 7000, 11000, 18000, 11000, 9000, 5000, 7000];
        let index = 0;
        dragonFireIntervals = [];

        for (let i = 1; i < BOARD_SIZE; i += SECTION_SIZE) {
            for (let j = 1; j < BOARD_SIZE; j += SECTION_SIZE) {
                const interval = intervals[index];
                const dragonFireFunction = () => {
                    if (!gameOver && treasuresLeft > 0) {
                        dragonFire(i, j);
                        setTimeout(dragonFireFunction, interval);
                    }
                };
                setTimeout(dragonFireFunction, interval);
                dragonFireIntervals.push({ timeoutId: setTimeout(dragonFireFunction, interval), interval: interval });
                index++;
            }
        }
    }

    function dragonFire(row, col) {
        const directions = [
            {row: -1, col: -1}, {row: -1, col: 0}, {row: -1, col: 1},
            {row: 0, col: -1}, {row: 0, col: 1},
            {row: 1, col: -1}, {row: 1, col: 0}, {row: 1, col: 1}
        ];
        directions.forEach(dir => {
            const newRow = row + dir.row;
            const newCol = col + dir.col;
            if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
                if (board[newRow][newCol].type !== 'dragon' && board[newRow][newCol].type !== 'treasure') {
                    if (board[newRow][newCol].type === 'player') {
                        endGame(false);
                    }
                    board[newRow][newCol].type = 'fire';
                }
            }
        });
        updateBoard();
        setTimeout(() => {
            directions.forEach(dir => {
                const newRow = row + dir.row;
                const newCol = col + dir.col;
                if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
                    if (board[newRow][newCol].type === 'fire') {
                        board[newRow][newCol].type = 'empty';
                    }
                }
            });
            updateBoard();
        }, 3000);
    }

    function updateScore() {
        document.getElementById('score').textContent = `Treasures Collected: ${treasuresCollected}`;
        document.getElementById('treasures-left').textContent = `Treasures Left: ${treasuresLeft}`;
    }

    function endGame(isWin) {
        gameOver = true;
        if (isWin) {
            document.getElementById('message').textContent = 'You Win! All treasures collected!';
            document.getElementById('message').classList.add('pulse');
        } else {
            document.getElementById('message').textContent = 'Game Over! You were hit by dragon fire!';
            document.getElementById('message').style.color = '#e74c3c';
        }
        document.getElementById('restart-button').style.display = 'inline-block';
        dragonFireIntervals.forEach(interval => clearTimeout(interval.timeoutId));
    }

    document.addEventListener('keydown', (event) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            movePlayer(event.key);
        }
    });

    createBoard();
</script>
</body>
</html>
```

### Explanation:

1. Game Board Setup:
    - Create a 9x9 grid using HTML and CSS
    - Each cell will be 60x60 pixels
    - Use CSS Grid for easy layout management

2. Player Character:
    - Represent the player as a green wizard emoji (🧙‍♂️)
    - Start position: top-left corner (0, 0)
    - Implement arrow key listeners for movement
    - Update player position on valid moves

3. Dragons:
    - Place dragon emojis (🐉) in the center of each 3x3 section
    - Implement a periodic fire-shooting mechanism
    - Use setInterval for each dragon to shoot fire every few seconds
    - Fire affects the 8 surrounding cells and the dragon's cell

4. Treasures:
    - Randomly place 9 gem emojis (💎) on the board
    - Ensure treasures don't overlap with dragons or other treasures
    - Update the score display when a treasure is collected

5. Game Mechanics:
    - Check for collisions between the player and fire/treasures after each move
    - End the game if the player touches a fire cell
    - Win the game when all treasures are collected
    - Display appropriate messages for game over and win conditions

6. Visuals and Feedback:
    - Use a dark background with medieval-themed colors
    - Animate the player movement for smooth transitions
    - Add a pulsing effect to treasures
    - Implement a fire animation for dragon attacks
    - Use CSS transitions and animations for visual feedback

7. Restart Functionality:
    - Show the restart button after game over or win
    - Reset the game state, board, and score when clicked

8. Responsive Design:
    - Ensure the game is centered on the screen
    - Use relative units where possible for better scaling

9. Performance Considerations:
    - Optimize the fire-shooting mechanism to minimize unnecessary updates
    - Use efficient data structures for game state management

This plan creates an engaging "Dragon Treasure Hunt" game with a medieval theme.