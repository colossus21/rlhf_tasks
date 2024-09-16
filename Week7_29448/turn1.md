### Code Plan:

1. UI Components:
   1. Game title
   2. Current player display
   3. Species selector with emoji buttons
   4. 6x6 game grid
   5. Score display for both players
   6. Game status message area
   7. Restart button

2. Gameplay Logic:
   1. Initialize game state
   2. Handle species selection
   3. Manage turn-based gameplay
   4. Calculate and update scores
   5. Check for game end condition
   6. Declare winner
   7. Implement game restart functionality

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eco Cycle</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #83a4d4, #b6fbff);
            color: #333;
        }
        #game-container {
            text-align: center;
            background-color: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        h1 {
            margin-bottom: 20px;
            color: #2c3e50;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        #board {
            display: grid;
            grid-template-columns: repeat(6, 70px);
            gap: 8px;
            margin-top: 20px;
            background-color: #ecf0f1;
            padding: 15px;
            border-radius: 10px;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
        }
        .cell {
            width: 70px;
            height: 70px;
            border: 2px solid #bdc3c7;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 36px;
            cursor: pointer;
            background-color: #fff;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .cell:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
        }
        .cell::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
            opacity: 0;
            transition: opacity 0.3s;
        }
        .cell:hover::after {
            opacity: 1;
        }
        .cell.player1 {
            border-color: #3498db;
        }
        .cell.player2 {
            border-color: #e74c3c;
        }
        #message {
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
            min-height: 1.5em;
        }
        #current-player {
            font-size: 20px;
            margin-bottom: 15px;
            color: #2980b9;
        }
        #restart-button {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #2ecc71;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
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
            padding: 10px;
            border-radius: 5px;
            transition: all 0.3s;
        }
        #species-selector {
            margin-top: 20px;
        }
        .species-button {
            font-size: 24px;
            margin: 0 5px;
            padding: 10px 15px;
            cursor: pointer;
            background-color: #4d4a45;
            border: none;
            border-radius: 50%;
            transition: all 0.3s;
        }
        .species-button:hover {
            transform: scale(1.1);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
        .species-button.selected {
            background-color: #d35400;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        .pulse {
            animation: pulse 0.5s;
        }
        .symbiosis {
            box-shadow: 0 0 15px rgba(46, 204, 113, 0.8);
        }
    </style>
</head>
<body>
<div id="game-container">
    <h1>Eco Cycle</h1>
    <div id="current-player">Current Player: <span id="player-name">Player 1</span></div>
    <div id="species-selector">
        <button class="species-button" onclick="selectSpecies('🌿')">🌿</button>
        <button class="species-button" onclick="selectSpecies('🐰')">🐰</button>
        <button class="species-button" onclick="selectSpecies('🦊')">🦊</button>
        <button class="species-button" onclick="selectSpecies('🍄')">🍄</button>
    </div>
    <div id="board"></div>
    <div id="score-container">
        <div id="player1-score" class="score">Player 1: 0</div>
        <div id="player2-score" class="score">Player 2: 0</div>
    </div>
    <div id="message"></div>
    <button id="restart-button" onclick="restartGame()">Restart Game</button>
</div>

<script>
    const BOARD_SIZE = 6;
    const PLAYERS = ['Player 1', 'Player 2'];
    const SPECIES = {
        PLANT: '🌿',
        HERBIVORE: '🐰',
        CARNIVORE: '🦊',
        DECOMPOSER: '🍄'
    };
    let currentPlayer = 0;
    let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    let selectedSpecies = null;
    let scores = [0, 0];

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
            cells[index].textContent = cell ? cell.species : '';
            cells[index].className = 'cell';
            if (cell) {
                cells[index].classList.add(cell.player === 0 ? 'player1' : 'player2');
            }
            cells[index].classList.remove('pulse', 'symbiosis');
        });
    }

    function selectSpecies(species) {
        selectedSpecies = species;
        document.querySelectorAll('.species-button').forEach(btn => btn.classList.remove('selected'));
        event.target.classList.add('selected');
    }

    function handleCellClick(row, col) {
        if (board[row][col] === null && selectedSpecies) {
            const scoreGained = getPlacementScore(row, col, selectedSpecies);
            board[row][col] = { species: selectedSpecies, player: currentPlayer };
            updateBoard();
            const cell = document.querySelectorAll('.cell')[row * BOARD_SIZE + col];
            cell.classList.add('pulse');
            scores[currentPlayer] += scoreGained;
            setTimeout(() => {
                updateScoreDisplay();
                switchPlayer();
                checkGameEnd();
            }, 500);
        }
    }

    function getPlacementScore(row, col, species) {
        let score = 1;  // Base score for placing a piece
        const neighbors = getNeighbors(row, col);

        switch (species) {
            case SPECIES.PLANT:
                score += neighbors.filter(n => n === SPECIES.DECOMPOSER).length;
                break;
            case SPECIES.HERBIVORE:
                score += neighbors.filter(n => n === SPECIES.PLANT).length;
                break;
            case SPECIES.CARNIVORE:
                score += neighbors.filter(n => n === SPECIES.HERBIVORE).length;
                break;
            case SPECIES.DECOMPOSER:
                score += neighbors.filter(n => n && n !== SPECIES.DECOMPOSER).length;
                break;
        }

        return score;
    }

    function getNeighbors(row, col) {
        const neighbors = [];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
                neighbors.push(board[newRow][newCol] ? board[newRow][newCol].species : null);
            }
        }
        return neighbors;
    }

    function updateScoreDisplay() {
        const player1Score = document.getElementById('player1-score');
        const player2Score = document.getElementById('player2-score');
        player1Score.textContent = `Player 1: ${scores[0]}`;
        player2Score.textContent = `Player 2: ${scores[1]}`;
        player1Score.style.backgroundColor = scores[0] > scores[1] ? '#2ecc71' : '#ecf0f1';
        player2Score.style.backgroundColor = scores[1] > scores[0] ? '#2ecc71' : '#ecf0f1';
    }

    function switchPlayer() {
        currentPlayer = 1 - currentPlayer;
        const playerName = document.getElementById('player-name');
        playerName.textContent = PLAYERS[currentPlayer];
        playerName.style.color = currentPlayer === 0 ? '#2980b9' : '#c0392b';
    }

    function checkGameEnd() {
        if (board.flat().every(cell => cell !== null)) {
            const winner = scores[0] > scores[1] ? PLAYERS[0] : (scores[1] > scores[0] ? PLAYERS[1] : "It's a tie");
            const message = document.getElementById('message');
            message.textContent = `Game Over! ${winner} wins!`;
            message.style.color = winner === PLAYERS[0] ? '#2980b9' : '#c0392b';
            document.getElementById('restart-button').style.display = 'inline-block';
        }
    }

    function restartGame() {
        board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
        currentPlayer = 0;
        scores = [0, 0];
        selectedSpecies = null;
        updateBoard();
        updateScoreDisplay();
        document.getElementById('message').textContent = '';
        document.getElementById('restart-button').style.display = 'none';
        document.getElementById('player-name').textContent = PLAYERS[currentPlayer];
        document.getElementById('player-name').style.color = '#2980b9';
        document.querySelectorAll('.species-button').forEach(btn => btn.classList.remove('selected'));
    }

    createBoard();
    updateBoard();
</script>
</body>
</html>
```

### Explanation:

1. User Interface:
    - The game will have a centered layout with 6x6 grid.
    - The title "Eco Cycle" will be displayed at the top. Below the title, there will be a current player indicator.
    - The species selector will consist of four emoji buttons (🌿, 🐰, 🦊, 🍄) with dark grey backgrounds, changing to orange when selected.
    - Player 1's moves will have blue borders, while Player 2's will have red borders.
    - Score displays for both players will be shown below the grid.
    - A message area for game status and winner declaration will be included.
    - A restart button will be available at the bottom.

2. Gameplay Mechanics:
    - The game starts with Player 1's turn.
    - Players select a species and then click on an empty cell to place it.
    - Each placement awards 1 point, with bonus points calculated based on adjacent species.  
    - Players alternate turns until the board is full.
    - Once all cells are filled, the game ends and declares the winner.

3. Scoring System:
    - Base score: 1 point per placement.
    - Plants: +1 for each adjacent Decomposer.
    - Herbivores: +1 for each adjacent Plant.
    - Carnivores: +1 for each adjacent Herbivore.
    - Decomposers: +1 for each adjacent species (except other Decomposers).

This plan creates an engaging and visually appealing 'Eco Cycle' game that combines strategic thinking with an educational aspect about ecosystem relationships.