### Code Plan:

UI Components:
1. Create a 6x6 grid for the game board
2. Design a glowing neon background for the board
3. Implement an animated starfield background
4. Add a player turn indicator
5. Create UFO (🛸) and Rocket (🚀) piece representations
6. Implement piece highlighting for valid moves
7. Add a game status display (current player, winner)
8. Include a restart button

Gameplay:
1. Initialize the game board with pieces in starting positions
2. Implement turn-based gameplay (alternating between players)
3. Define valid move rules for regular pieces and kings
4. Handle piece selection and movement
5. Implement capturing logic
6. Check for win conditions
7. Allow game restart functionality

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Space Checkers</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #000;
            color: #fff;
            overflow: hidden;
            background-image:
                    radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
                    radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
                    radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),
                    radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px);
            background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
            background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
            animation: backgroundAnimation 60s linear infinite;
        }
        @keyframes backgroundAnimation {
            0% { background-position: 0 0, 40px 60px, 130px 270px, 70px 100px; }
            100% { background-position: 550px 550px, 390px 410px, 380px 820px, 220px 650px; }
        }
        #game-container {
            text-align: center;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 20px;
            border-radius: 15px;
            box-shadow:
                    0 0 10px #0ff,
                    0 0 20px #0ff,
                    0 0 30px #0ff,
                    0 0 40px #0ff,
                    0 0 70px #0ff;
            animation: pulsate 1.5s infinite alternate;
        }
        @keyframes pulsate {
            100% {
                box-shadow:
                        0 0 15px #0ff,
                        0 0 30px #0ff,
                        0 0 45px #0ff,
                        0 0 60px #0ff,
                        0 0 90px #0ff;
            }
        }
        #board {
            display: grid;
            grid-template-columns: repeat(6, 60px);
            grid-template-rows: repeat(6, 60px);
            gap: 2px;
            margin: 20px auto;
            background-color: rgba(17, 17, 17, 0.8);
            padding: 10px;
            border-radius: 10px;
            position: relative;
        }
        .cell {
            width: 60px;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 40px;
            cursor: pointer;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        .cell.dark {
            background-color: #1a1a1a;
        }
        .cell.light {
            background-color: #2a2a2a;
        }
        .piece {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            transition: all 0.3s;
        }
        .piece.red { background-color: #ff4136; }
        .piece.blue { background-color: #0074d9; }
        .piece.king::after {
            content: '👑';
            font-size: 20px;
            position: absolute;
        }
        #message {
            font-size: 24px;
            margin-top: 20px;
        }
        #restart-button {
            font-size: 18px;            
            padding: 10px 20px;
            background-color: #3d9970;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            display: none;
            margin: 20px auto;
        }
        #starfield {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            height: 150px;
            overflow: hidden;
        }
        .star {
            position: absolute;
            background-color: #fff;
            width: 2px;
            height: 2px;
            border-radius: 50%;
            opacity: 0.5;
            animation: twinkle 3s infinite, fall 10s linear infinite;
        }
        @keyframes twinkle {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        @keyframes fall {
            0% { transform: translateY(-150px); }
            100% { transform: translateY(0); }
        }
    </style>
</head>
<body>
<div id="game-container">
    <h1>Space Checkers</h1>
    <div id="board"></div>
    <div id="message"></div>
    <button id="restart-button">Restart Game</button>
    <div id="starfield"></div>
</div>

<script>
    // The JavaScript code remains unchanged
    const BOARD_SIZE = 6;
    const PLAYERS = { RED: 'red', BLUE: 'blue' };
    let board = [];
    let currentPlayer = PLAYERS.RED;
    let selectedPiece = null;
    let gameOver = false;

    function createBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = `cell ${(i + j) % 2 === 0 ? 'light' : 'dark'}`;
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => handleCellClick(i, j));
                boardElement.appendChild(cell);

                if ((i + j) % 2 !== 0) {
                    if (i < 2) {
                        board[i][j] = { player: PLAYERS.RED, isKing: false };
                    } else if (i > 3) {
                        board[i][j] = { player: PLAYERS.BLUE, isKing: false };
                    } else {
                        board[i][j] = null;
                    }
                } else {
                    board[i][j] = null;
                }
            }
        }
        updateBoardDisplay();
    }

    function updateBoardDisplay() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const piece = board[row][col];
            cell.innerHTML = '';
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.className = `piece ${piece.player}${piece.isKing ? ' king' : ''}`;
                pieceElement.textContent = piece.player === PLAYERS.RED ? '🚀' : '🛸';
                cell.appendChild(pieceElement);
            }
        });
    }

    function handleCellClick(row, col) {
        if (gameOver) return;

        const piece = board[row][col];
        if (piece && piece.player === currentPlayer) {
            selectedPiece = { row, col };
            highlightMoves(row, col);
        } else if (selectedPiece) {
            const validMove = isValidMove(selectedPiece.row, selectedPiece.col, row, col);
            if (validMove) {
                movePiece(selectedPiece.row, selectedPiece.col, row, col);
                selectedPiece = null;
                clearHighlights();
                checkForWin();
                if (!gameOver) {
                    switchPlayer();
                }
            }
        }
    }

    function highlightMoves(row, col) {
        clearHighlights();
        const moves = getValidMoves(row, col);
        moves.forEach(move => {
            const cell = document.querySelector(`.cell[data-row="${move.row}"][data-col="${move.col}"]`);
            cell.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
        });
    }

    function clearHighlights() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.backgroundColor = '';
        });
    }

    function getValidMoves(row, col) {
        const piece = board[row][col];
        const moves = [];
        const directions = piece.isKing ? [-1, 1] : (piece.player === PLAYERS.RED ? [1] : [-1]);

        directions.forEach(rowDir => {
            [-1, 1].forEach(colDir => {
                let newRow = row + rowDir;
                let newCol = col + colDir;
                if (isValidCell(newRow, newCol) && !board[newRow][newCol]) {
                    moves.push({ row: newRow, col: newCol });
                } else if (isValidCell(newRow, newCol) && board[newRow][newCol] && board[newRow][newCol].player !== piece.player) {
                    let jumpRow = newRow + rowDir;
                    let jumpCol = newCol + colDir;
                    if (isValidCell(jumpRow, jumpCol) && !board[jumpRow][jumpCol]) {
                        moves.push({ row: jumpRow, col: jumpCol, capture: { row: newRow, col: newCol } });
                    }
                }
            });
        });

        return moves;
    }

    function isValidMove(fromRow, fromCol, toRow, toCol) {
        const moves = getValidMoves(fromRow, fromCol);
        return moves.some(move => move.row === toRow && move.col === toCol);
    }

    function movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = board[fromRow][fromCol];
        board[toRow][toCol] = piece;
        board[fromRow][fromCol] = null;

        if ((piece.player === PLAYERS.RED && toRow === BOARD_SIZE - 1) ||
            (piece.player === PLAYERS.BLUE && toRow === 0)) {
            piece.isKing = true;
        }

        const capturedPiece = getCapturedPiece(fromRow, fromCol, toRow, toCol);
        if (capturedPiece) {
            board[capturedPiece.row][capturedPiece.col] = null;
        }

        updateBoardDisplay();
    }

    function getCapturedPiece(fromRow, fromCol, toRow, toCol) {
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        if (rowDiff === 2 && colDiff === 2) {
            const midRow = (fromRow + toRow) / 2;
            const midCol = (fromCol + toCol) / 2;
            return { row: midRow, col: midCol };
        }
        return null;
    }

    function isValidCell(row, col) {
        return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === PLAYERS.RED ? PLAYERS.BLUE : PLAYERS.RED;
        document.getElementById('message').textContent = `${currentPlayer.toUpperCase()}'s turn`;
    }

    function checkForWin() {
        const redPieces = board.flat().filter(cell => cell && cell.player === PLAYERS.RED);
        const bluePieces = board.flat().filter(cell => cell && cell.player === PLAYERS.BLUE);

        if (redPieces.length === 0) {
            endGame(PLAYERS.BLUE);
        } else if (bluePieces.length === 0) {
            endGame(PLAYERS.RED);
        }
    }

    function endGame(winner) {
        gameOver = true;
        document.getElementById('message').textContent = `${winner.toUpperCase()} wins!`;
        document.getElementById('restart-button').style.display = 'block';
    }

    function restartGame() {
        gameOver = false;
        currentPlayer = PLAYERS.RED;
        selectedPiece = null;
        document.getElementById('message').textContent = `${currentPlayer.toUpperCase()}'s turn`;
        document.getElementById('restart-button').style.display = 'none';
        createBoard();
    }

    function createStars() {
        const starfield = document.getElementById('starfield');
        const starCount = 50;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 10}s`;
            starfield.appendChild(star);
        }
    }

    document.getElementById('restart-button').addEventListener('click', restartGame);
    createBoard();
    createStars();
    document.getElementById('message').textContent = `${currentPlayer.toUpperCase()}'s turn`;
</script>
</body>
</html>
```

### Explanation:

1. 6x6 Grid:
   The game board will be created using a 6x6 grid layout. This compact size allows for quicker games while still providing strategic depth.

2. Glowing Neon Background:
   The game board will feature a glowing neon effect, created using CSS animations and box shadows. This will give the game a futuristic, space-age appearance that fits the theme.

3. UFO and Rocket Pieces:
   Players' pieces will be represented by emojis: rockets for one player and UFOs for the other. This adds a fun, space-themed twist to the traditional checker pieces.

4. Animated Starfield Background:
   The game's background will feature an animated starfield effect. This will be achieved using CSS animations, creating the illusion of moving through space and enhancing the overall theme.

5. Highlight Pieces and Player Indicator:
   Valid moves will be highlighted when a piece is selected, making it easier for players to see their options. A player indicator will clearly show whose turn it is, improving the game's usability.

This implementation creates an engaging, space-themed version of Checkers.