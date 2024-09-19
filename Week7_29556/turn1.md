### Code Plan:

1. UI Components:
   1. Create a responsive game container
   2. Design a 6x12 grid for the game board
   3. Implement a starfield background with CSS animations
   4. Add score and level displays with glowing effects
   5. Create a game over overlay with restart button
   6. Style the falling blocks with unique colors for each value

2. Gameplay:
   1. Initialize the game board and state variables
   2. Implement block generation and falling mechanics
   3. Create functions for left and right movement
   4. Develop merging logic for vertical collisions
   5. Implement gravity and block settling
   6. Add scoring system and level progression
   7. Create game over detection and handling
   8. Implement restart functionality

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Space Numbers</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            font-family: Arial, sans-serif;
            background-color: #000;
            color: #fff;
        }
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #0a0a2a;
            color: #ffffff;
        }
        #game-container {
            text-align: center;
            z-index: 1;
        }
        #board {
            display: grid;
            grid-template-columns: repeat(6, 50px);
            gap: 2px;
            margin-top: 20px;
            background-color: rgba(22, 33, 62, 0.7);
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }
        .cell {
            width: 50px;
            height: 50px;
            border: 1px solid #aaa;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            font-weight: bold;
            transition: all 0.3s ease;
            color: #fff;
            text-shadow: 1px 1px 2px #000;
        }
        #score, #level {
            font-size: 24px;
            margin: 10px 0;
            text-shadow: 0 0 5px #00ffff;
        }
        #game-over {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.8);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #45a049;
        }
        #space-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
        }
        .star {
            position: absolute;
            background-color: #fff;
            border-radius: 50%;
        }
        @keyframes twinkle {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
        }
    </style>
</head>
<body>
<div id="space-background"></div>
<div id="game-container">
    <h1>Space Numbers</h1>
    <div id="score">Score: 0</div>
    <div id="level">Level: 1</div>
    <div id="board"></div>
    <div id="game-over">
        <h2>Game Over</h2>
        <p>Your score: <span id="final-score"></span></p>
        <button onclick="restartGame()">Play Again</button>
    </div>
</div>

<script>
    const BOARD_WIDTH = 6;
    const BOARD_HEIGHT = 12;
    const COLORS = {
        2: '#ff4136',
        4: '#ff851b',
        8: '#ffdc00',
        16: '#2ecc40',
        32: '#0074d9',
        64: '#b10dc9',
        128: '#f012be',
        256: '#01ff70',
        512: '#7fdbff'
    };
    const BLOCK_VALUES = [2, 4, 8, 16, 32, 64, 128, 256, 512];

    let board = [];
    let score = 0;
    let level = 1;
    let currentPiece = null;
    let gameInterval = null;

    function createStars() {
        const spaceBackground = document.getElementById('space-background');
        for (let i = 0; i < 200; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = star.style.height = Math.random() * 3 + 'px';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite`;
            spaceBackground.appendChild(star);
        }
    }

    function createBoard() {
        const boardElement = document.getElementById('board');
        boardElement.style.gridTemplateColumns = `repeat(${BOARD_WIDTH}, 50px)`;
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            board[i] = [];
            for (let j = 0; j < BOARD_WIDTH; j++) {
                board[i][j] = 0;
                const cell = document.createElement('div');
                cell.className = 'cell';
                boardElement.appendChild(cell);
            }
        }
    }

    function updateBoard() {
        const cells = document.querySelectorAll('.cell');
        board.flat().forEach((value, index) => {
            cells[index].textContent = value || '';
            cells[index].style.backgroundColor = value ? COLORS[value] : 'transparent';
        });
    }

    function createNewPiece() {
        const value = BLOCK_VALUES[Math.floor(Math.random() * BLOCK_VALUES.length)];
        const column = Math.floor(Math.random() * BOARD_WIDTH);
        currentPiece = { value, row: 0, column };
        if (board[0][column] !== 0) {
            gameOver();
        } else {
            board[0][column] = value;
        }
    }

    function movePieceDown() {
        if (currentPiece.row + 1 < BOARD_HEIGHT && board[currentPiece.row + 1][currentPiece.column] === 0) {
            board[currentPiece.row][currentPiece.column] = 0;
            currentPiece.row++;
            board[currentPiece.row][currentPiece.column] = currentPiece.value;
        } else {
            checkForMerges();
            createNewPiece();
        }
        updateBoard();
    }

    function checkForMerges() {
        let mergeHappened = false;
        for (let i = BOARD_HEIGHT - 1; i >= 0; i--) {
            for (let j = 0; j < BOARD_WIDTH; j++) {
                if (board[i][j] !== 0 && i > 0 && board[i][j] === board[i-1][j]) {
                    const mergedValue = board[i][j] * 2;
                    board[i][j] = mergedValue > 512 ? 512 : mergedValue;
                    score += board[i][j];
                    board[i-1][j] = 0;
                    mergeHappened = true;
                }
            }
        }
        if (mergeHappened) {
            applyGravity();
            checkForMerges();
        }
        updateScore();
    }

    function applyGravity() {
        for (let j = 0; j < BOARD_WIDTH; j++) {
            let writeIndex = BOARD_HEIGHT - 1;
            for (let i = BOARD_HEIGHT - 1; i >= 0; i--) {
                if (board[i][j] !== 0) {
                    board[writeIndex][j] = board[i][j];
                    if (i !== writeIndex) {
                        board[i][j] = 0;
                    }
                    writeIndex--;
                }
            }
        }
    }

    function moveLeft() {
        if (currentPiece.column > 0 && board[currentPiece.row][currentPiece.column - 1] === 0) {
            board[currentPiece.row][currentPiece.column] = 0;
            currentPiece.column--;
            board[currentPiece.row][currentPiece.column] = currentPiece.value;
            updateBoard();
        }
    }

    function moveRight() {
        if (currentPiece.column < BOARD_WIDTH - 1 && board[currentPiece.row][currentPiece.column + 1] === 0) {
            board[currentPiece.row][currentPiece.column] = 0;
            currentPiece.column++;
            board[currentPiece.row][currentPiece.column] = currentPiece.value;
            updateBoard();
        }
    }

    function updateScore() {
        document.getElementById('score').textContent = `Score: ${score}`;
        level = Math.floor(score / 1000) + 1;
        document.getElementById('level').textContent = `Level: ${level}`;
        clearInterval(gameInterval);
        gameInterval = setInterval(movePieceDown, Math.max(100, 1000 - (level - 1) * 50));
    }

    function gameOver() {
        clearInterval(gameInterval);
        document.getElementById('game-over').style.display = 'block';
        document.getElementById('final-score').textContent = score;
    }

    function restartGame() {
        board = board.map(row => row.fill(0));
        score = 0;
        level = 1;
        document.getElementById('game-over').style.display = 'none';
        updateScore();
        createNewPiece();
        gameInterval = setInterval(movePieceDown, 1000);
        updateBoard();
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'ArrowDown':
                movePieceDown();
                break;
        }
    });

    createStars();
    createBoard();
    createNewPiece();
    gameInterval = setInterval(movePieceDown, 1000);
    updateBoard();
</script>
</body>
</html>
```

### Explanation:

1. Game Board: A 6x12 grid is created using CSS Grid layout, providing ample space for gameplay while maintaining a compact design.
2. Block Values and Colors: The game uses an array of possible block values (2 to 512) and a color mapping object to assign unique colors to each value. New blocks are randomly selected from this array.
3. Player Controls: Event listeners are added for arrow key presses. Left and right arrows move the current block horizontally, while the down arrow accelerates its descent.
4. Merging Mechanics: When a block lands, the game checks for vertical matches. If two blocks with the same value are adjacent vertically, they merge into a single block with double the value, up to a maximum of 512.
5. Space Theme: The background features a starfield effect created using CSS animations. Stars are generated as div elements with random sizes and positions, and a twinkling animation is applied.
6. Scoring and Difficulty: The score increases when blocks merge. The level increases for every 1000 points, and the game speed increases with each level, making blocks fall faster.
7. Game Over: The game ends when a new block cannot be placed at the top of the board. This is checked each time a new block is generated.
8. Restart Option: A restart button appears on the game over screen, allowing players to reset the game state and start a new game.
9. Visual Appeal: The cosmic theme is reinforced with a dark background, glowing text for score and level, and vibrant colors for the blocks. CSS transitions are used to smooth out block movements and merges.

This implementation creates an engaging game that challenges players to think strategically about block placement and merging, all while enjoying a space-themed aesthetic.