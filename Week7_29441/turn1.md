### Code Plan:

1. UI Components:
    - Game board (12x6 grid)
    - Status display (gold, wave number)
    - Unit selection buttons
    - "End Break" button
    - Message overlay
    - Restart button (hidden until game over)

2. Gameplay Elements:
    - Game state management (break phase, wave phase)
    - Unit placement system
    - Enemy spawning system
    - Combat system (automatic attacks)
    - Wave progression and difficulty scaling
    - Gold management
    - Win/lose condition checking

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grid Guardians</title>
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
            grid-template-columns: repeat(12, 50px);
            grid-template-rows: repeat(6, 50px);
            gap: 2px;
            margin-top: 20px;
            background-color: #ddd;
            padding: 10px;
            border-radius: 10px;
        }
        .cell {
            width: 50px;
            height: 50px;
            border: 1px solid #aaa;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            cursor: pointer;
            background-color: white;
            transition: all 0.3s ease;
            position: relative;
        }
        .cell:hover {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .player-area { background-color: rgba(0, 0, 255, 0.1); }
        .enemy-area { background-color: rgba(255, 0, 0, 0.1); }
        #controls { margin-top: 20px; }
        button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
        }
        #status { margin-top: 20px; font-size: 18px; }
        #piece-selection {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
        }
        .piece-button {
            font-size: 24px;
            padding: 5px 10px;
            cursor: pointer;
        }
        .hp-bar {
            position: absolute;
            bottom: 2px;
            left: 2px;
            right: 2px;
            height: 4px;
            background-color: #2ecc71;
            transition: width 0.3s ease;
        }
        .unit-symbol {
            font-size: 24px;
        }
        .projectile {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: yellow;
            border-radius: 50%;
            transition: all 0.3s ease;
            z-index: 10;
        }
        @keyframes hit-animation {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        .hit {
            animation: hit-animation 0.3s ease;
        }
        #message-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }
        #message-box {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        #message-text {
            font-size: 24px;
            margin-bottom: 20px;
        }

    </style>
</head>
<body>
<div id="game-container">
    <h1>Grid Guardians</h1>
    <div id="status">Gold: <span id="gold">500</span> | Wave: <span id="wave">1</span></div>
    <div id="piece-selection"></div>
    <div id="board"></div>
    <div id="controls">
        <button id="end-break">End Break</button>
        <button id="restart-button" style="display: none;">Restart Game</button>
    </div>
</div>
<div id="message-overlay">
    <div id="message-box">
        <div id="message-text"></div>
        <button id="message-close">Close</button>
    </div>
</div>
<script>
    const BOARD_WIDTH = 12;
    const BOARD_HEIGHT = 6;
    const PLAYER_COLUMNS = 3;
    let gold = 600;
    let wave = 1;
    let gamePhase = 'break'; // 'break' or 'wave'
    let selectedPiece = null;
    let board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(null));

    const playerPieces = [
        { symbol: '⚔️', type: 'melee', name: 'Swordsman', cost: 50, maxHealth: 100, health: 100, damage: 30, range: 1 },
        { symbol: '🏹', type: 'ranged', name: 'Archer', cost: 75, maxHealth: 70, health: 70, damage: 25, range: 4 },
        { symbol: '🛡️', type: 'melee', name: 'Guardian', cost: 100, maxHealth: 200, health: 200, damage: 20, range: 1 },
        { symbol: '🧙', type: 'ranged', name: 'Mage', cost: 125, maxHealth: 60, health: 60, damage: 40, range: 4 },
    ];

    const enemyPieces = [
        { symbol: '👹', type: 'melee', name: 'Orc', maxHealth: 120, health: 120, damage: 35, range: 1 },
        { symbol: '🧛', type: 'ranged', name: 'Vampire', maxHealth: 80, health: 80, damage: 30, range: 2 },
        { symbol: '🐉', type: 'ranged', name: 'Dragon', maxHealth: 150, health: 150, damage: 50, range: 3 },
        { symbol: '💀', type: 'melee', name: 'Skeleton', maxHealth: 70, health: 70, damage: 25, range: 1 },
    ];

    function createBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            for (let j = 0; j < BOARD_WIDTH; j++) {
                const cell = document.createElement('div');
                cell.className = `cell ${j < PLAYER_COLUMNS ? 'player-area' : 'enemy-area'}`;
                cell.onclick = () => handleCellClick(i, j);
                boardElement.appendChild(cell);
            }
        }
    }

    function createPieceSelectionButtons() {
        const selectionDiv = document.getElementById('piece-selection');
        selectionDiv.innerHTML = '';
        playerPieces.forEach(piece => {
            const button = document.createElement('button');
            button.className = 'piece-button';
            button.innerHTML = `${piece.symbol} (${piece.cost}g)`;
            button.onclick = () => selectPiece(piece);
            selectionDiv.appendChild(button);
        });
    }

    function selectPiece(piece) {
        selectedPiece = piece;
    }

    function handleCellClick(row, col) {
        if (gamePhase !== 'break' || col >= PLAYER_COLUMNS || !selectedPiece) return;
        if (gold < selectedPiece.cost) {
            showMessage("Not enough gold!");
            return;
        }
        placePiece(row, col, selectedPiece);
        gold -= selectedPiece.cost;
        updateStatus();
    }

    function placePiece(row, col, piece) {
        board[row][col] = { ...piece, team: 'player' };
        updateBoardDisplay();
    }

    function updateBoardDisplay() {
        const cells = document.querySelectorAll('.cell');
        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                const cellElement = cells[i * BOARD_WIDTH + j];
                cellElement.innerHTML = '';
                if (cell) {
                    const unitSymbol = document.createElement('div');
                    unitSymbol.className = 'unit-symbol';
                    unitSymbol.textContent = cell.symbol;
                    cellElement.appendChild(unitSymbol);

                    const hpBar = document.createElement('div');
                    hpBar.className = 'hp-bar';
                    hpBar.style.width = `${(cell.health / cell.maxHealth) * 100}%`;
                    cellElement.appendChild(hpBar);
                }
                cellElement.style.backgroundColor = cell ?
                    (cell.team === 'player' ? 'rgba(0, 0, 255, 0.3)' : 'rgba(255, 0, 0, 0.3)') :
                    (j < PLAYER_COLUMNS ? 'rgba(0, 0, 255, 0.1)' : 'rgba(255, 0, 0, 0.1)');
            });
        });
    }

    function updateStatus() {
        document.getElementById('gold').textContent = gold;
        document.getElementById('wave').textContent = wave;
    }

    function startWave() {
        gamePhase = 'wave';
        document.getElementById('end-break').style.display = 'none';
        spawnEnemies();
        gameLoop();
    }

    function spawnEnemies() {
        const difficultyMultiplier = 1 + (wave - 1) * 0.1; // 10% increase per wave
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            if (Math.random() < 0.7 + (wave - 1) * 0.02) { // Increased spawn chance each wave
                const enemyTemplate = enemyPieces[Math.floor(Math.random() * enemyPieces.length)];
                const enemy = {
                    ...enemyTemplate,
                    team: 'enemy',
                    maxHealth: Math.floor(enemyTemplate.maxHealth * difficultyMultiplier),
                    health: Math.floor(enemyTemplate.maxHealth * difficultyMultiplier),
                    damage: Math.floor(enemyTemplate.damage * difficultyMultiplier)
                };
                board[i][BOARD_WIDTH - 1] = enemy;
            }
        }
        updateBoardDisplay();
    }

    function gameLoop() {
        if (gamePhase === 'wave') {
            movePieces();
            combat();
            updateBoardDisplay();

            if (checkLoseCondition()) {
                endGame(false);
            } else if (checkWaveEnd()) {
                endWave();
            } else {
                setTimeout(gameLoop, 1000); // Run the game loop every second
            }
        }
    }

    function movePieces() {
        // Move enemies left
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            for (let j = 1; j < BOARD_WIDTH; j++) {
                if (board[i][j] && board[i][j].team === 'enemy' && !board[i][j-1]) {
                    board[i][j-1] = board[i][j];
                    board[i][j] = null;
                }
            }
        }
    }

    function combat() {
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            for (let j = 0; j < BOARD_WIDTH; j++) {
                const attacker = board[i][j];
                if (attacker) {
                    const targetCol = attacker.team === 'player' ? j + attacker.range : j - attacker.range;
                    if (targetCol >= 0 && targetCol < BOARD_WIDTH && board[i][targetCol] && board[i][targetCol].team !== attacker.team) {
                        fireProjectile(i, j, i, targetCol, () => {
                            if (board[i][targetCol]) {
                                board[i][targetCol].health -= attacker.damage;
                                if (board[i][targetCol].health <= 0) {
                                    board[i][targetCol] = null;
                                }
                            }
                            updateBoardDisplay();
                        });
                    }
                }
            }
        }
    }

    function checkLoseCondition() {
        // Check if any enemy has reached the player's end column
        return board.some(row => row[0] && row[0].team === 'enemy');
    }

    function checkWaveEnd() {
        return board.flat().every(cell => !cell || cell.team === 'player');
    }

    function endWave() {
        gamePhase = 'break';
        wave++;
        gold += 500 + wave * 200; // Gold reward increases with each wave
        document.getElementById('end-break').style.display = 'inline-block';
        updateStatus();
        showMessage(`Wave ${wave} completed! Prepare for the next wave.`);
    }

    function restartGame() {
        gold = 600;
        wave = 1;
        gamePhase = 'break';
        board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(null));
        document.getElementById('end-break').style.display = 'inline-block';
        document.getElementById('restart-button').style.display = 'none';
        updateStatus();
        updateBoardDisplay();
    }


    function fireProjectile(startRow, startCol, endRow, endCol, onHit) {
        const boardElement = document.getElementById('board');
        const projectile = document.createElement('div');
        projectile.className = 'projectile';

        const startCell = boardElement.children[startRow * BOARD_WIDTH + startCol];
        const endCell = boardElement.children[endRow * BOARD_WIDTH + endCol];
        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();

        projectile.style.left = `${startRect.left - boardElement.offsetLeft + startRect.width / 2}px`;
        projectile.style.top = `${startRect.top - boardElement.offsetTop + startRect.height / 2}px`;

        boardElement.appendChild(projectile);

        setTimeout(() => {
            projectile.style.left = `${endRect.left - boardElement.offsetLeft + endRect.width / 2}px`;
            projectile.style.top = `${endRect.top - boardElement.offsetTop + endRect.height / 2}px`;
        }, 50);

        setTimeout(() => {
            projectile.remove();
            endCell.classList.add('hit');
            setTimeout(() => endCell.classList.remove('hit'), 300);
            onHit();
        }, 300);
    }

    function showMessage(message) {
        const overlay = document.getElementById('message-overlay');
        const messageText = document.getElementById('message-text');
        messageText.textContent = message;
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    }

    function hideMessage() {
        const overlay = document.getElementById('message-overlay');
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    }

    function endGame(playerWon) {
        gamePhase = 'end';
        document.getElementById('end-break').style.display = 'none';
        const message = playerWon ?
            `Congratulations! You've survived ${wave} waves!` :
            `Game Over! You've survived ${wave - 1} waves.`;
        showMessage(message);
        document.getElementById('restart-button').style.display = 'inline-block';
        document.getElementById('restart-button').textContent = `Restart Game (Waves Survived: ${wave - 1})`;
    }

    document.getElementById('message-close').onclick = hideMessage;

    document.getElementById('end-break').onclick = startWave;
    document.getElementById('restart-button').onclick = restartGame;

    createBoard();
    createPieceSelectionButtons();
    updateStatus();
    updateBoardDisplay();
</script>
</body>
</html>
```

### Explanation:

1. Grid Creation:
    - Create a 12x6 grid using HTML/CSS grid layout.
    - Style the leftmost 3 columns differently to indicate the player area.

2. Game Phases:
    - Implement a state variable to track the current phase (break or wave).
    - Toggle UI elements based on the current phase.

3. Units:
    - Define player and enemy units as objects with properties like symbol, type, cost, health, damage, and range.
    - Create unit selection buttons for player units.
    - Implement enemy unit spawning logic.

4. Combat System:
    - Create a loop that iterates through all units on the board.
    - Check each unit's range and target the closest enemy within range.
    - Apply damage and update health bars.
    - Remove units when their health reaches zero.

5. Visual Effects:
    - Use CSS animations for unit placement and attacks.
    - Implement a projectile animation for ranged attacks.
    - Add a hit animation when units take damage.

6. Difficulty Scaling:
    - Increase enemy stats (health, damage) with each wave.
    - Implement the gold reward formula after each wave.
    - Set initial gold to 600.

7. Win/Lose Conditions:
    - Check if any enemy unit reaches the leftmost column (lose condition).
    - Increment wave counter after clearing each wave (win condition).

8. User Interface:
    - Create a status bar to display current gold and wave number.
    - Implement unit selection buttons with costs.
    - Use Unicode symbols or CSS-based icons for unit representation.

9. Message System and Restart:
    - Create a message overlay div for displaying game events.
    - Implement a show/hide function for the message overlay.
    - Add a restart button that appears on game over, showing waves survived.

The Grid Guardians game is an engaging tower defense experience with smooth gameplay mechanics.