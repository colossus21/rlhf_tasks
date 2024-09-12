### Code Plan:

1. UI Elements:
   1. Game title
   2. Current player display
   3. Turn number display
   4. 6x6 grid board
   5. Building buttons (Farm, Mining Camp, Military)
   6. Resource display for both players
   7. Message display area
   8. Skip turn button
   9. Restart button (hidden until game end)

2. Gameplay Elements:
   1. Game state management (board, resources, current player)
   2. Building placement logic
   3. Resource production and consumption
   4. Military zone control
   5. Win condition check
   6. Turn management
   7. Game restart functionality

### Code Placeholder:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Micro Civ</title>
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
            gap: 2px;
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
            position: relative;
        }
        .cell:hover {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .player-indicator {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }
        .piece {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
        }
        .red { background-color: #ff4136; color: white; }
        .blue { background-color: #0074d9; color: white; }
        .military-zone-red { background-color: rgba(255, 65, 54, 0.2); }
        .military-zone-blue { background-color: rgba(0, 116, 217, 0.2); }
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
        #restart-button, #skip-turn-button {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #restart-button {
            display: none;
            background-color: #2ecc40;
        }
        #restart-button:hover {
            background-color: #27ae60;
        }
        #skip-turn-button {
            background-color: #ff851b;
            margin-left: 10px;
        }
        #skip-turn-button:hover {
            background-color: #e67e22;
        }
        #resources-container {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
        }
        .resources {
            font-size: 18px;
            font-weight: bold;
        }
        #build-options {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            gap: 10px;
        }
        .build-button {
            padding: 5px 10px;
            font-size: 14px;
            cursor: pointer;
        }
        .build-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        #turn-info {
            margin-top: 10px;
            font-size: 16px;
        }
        .tooltip {
            position: relative;
            display: inline-block;
        }
        .tooltip .tooltiptext {
            visibility: hidden;
            width: 120px;
            background-color: #555;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            margin-left: -60px;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .tooltip:hover .tooltiptext {
            visibility: visible;
            opacity: 1;
        }
    </style>
</head>
<body>
<div id="game-container">
    <h1>Micro Civ</h1>
    <div id="current-player">Current Player: <span id="player-name" class="red-text">Red</span></div>
    <div id="turn-info">Turn: <span id="turn-number">1</span></div>
    <div id="board"></div>
    <div id="build-options">
        <div class="tooltip">
            <button class="build-button" onclick="selectBuilding('🌾')">Farm (🌾)</button>
            <span class="tooltiptext">Gives 1 food, Free to build</span>
        </div>
        <div class="tooltip">
            <button class="build-button" onclick="selectBuilding('⛏️')">Mining Camp (⛏️)</button>
            <span class="tooltiptext">Gives 1 gold, Costs 1 food</span>
        </div>
        <div class="tooltip">
            <button class="build-button" onclick="selectBuilding('⚔️')">Military (⚔️)</button>
            <span class="tooltiptext">Controls territory, Costs 2 food and 2 gold</span>
        </div>
    </div>
    <div id="resources-container">
        <div id="red-resources" class="resources red-text">Red: 0 Food, 0 Gold</div>
        <div id="blue-resources" class="resources blue-text">Blue: 0 Food, 0 Gold</div>
    </div>
    <div id="message"></div>
    <button id="restart-button" onclick="restartGame()">Restart Game</button>
    <button id="skip-turn-button" onclick="skipTurn()">Skip Turn</button>
</div>

<script>
    const BOARD_SIZE = 6;
    const PLAYERS = ['Red', 'Blue'];
    const BUILDINGS = {
        FARM: '🌾',
        MINING: '⛏️',
        MILITARY: '⚔️'
    };
    let currentPlayer = 0;
    let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    let militaryZones = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    let selectedBuilding = null;
    let resources = [
        { food: 0, gold: 0 },
        { food: 0, gold: 0 }
    ];
    let turn = 1;

    function createBoard() {
        const boardElement = document.getElementById('board');
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.onclick = () => handleCellClick(i, j);
                const playerIndicator = document.createElement('div');
                playerIndicator.className = 'player-indicator';
                cell.appendChild(playerIndicator);
                boardElement.appendChild(cell);
            }
        }
    }

    function updateBoard() {
        const cells = document.querySelectorAll('.cell');
        board.flat().forEach((cell, index) => {
            cells[index].innerHTML = '';  // Clear the cell
            const playerIndicator = document.createElement('div');
            playerIndicator.className = 'player-indicator';
            cells[index].appendChild(playerIndicator);

            if (cell) {
                const piece = document.createElement('div');
                piece.className = `piece ${PLAYERS[cell.player].toLowerCase()}`;
                piece.textContent = cell.building;
                cells[index].appendChild(piece);

                playerIndicator.classList.add(PLAYERS[cell.player].toLowerCase());
            }

            // Add military zone indicator
            const row = Math.floor(index / BOARD_SIZE);
            const col = index % BOARD_SIZE;
            if (militaryZones[row][col] !== null) {
                cells[index].classList.add(`military-zone-${PLAYERS[militaryZones[row][col]].toLowerCase()}`);
            } else {
                cells[index].classList.remove('military-zone-red', 'military-zone-blue');
            }
        });
        updateResources();
        updateBuildButtons();
    }

    function selectBuilding(building) {
        selectedBuilding = building;
    }

    function handleCellClick(row, col) {
        if (!selectedBuilding || board[row][col] !== null) {
            const messageElement = document.getElementById('message');
            messageElement.innerText = "Pick a structure to build!";
            return;
        }

        if (militaryZones[row][col] !== null && militaryZones[row][col] !== currentPlayer) {
            const messageElement = document.getElementById('message');
            messageElement.innerText = "You can't build in the opponent's military zone!";
            return;
        }

        let cost = { food: 0, gold: 0 };
        let gain = { food: 0, gold: 0 };

        switch (selectedBuilding) {
            case BUILDINGS.FARM:
                gain.food = 1;
                break;
            case BUILDINGS.MINING:
                cost.food = 1;
                gain.gold = 1;
                break;
            case BUILDINGS.MILITARY:
                cost.food = 2;
                cost.gold = 2;
                break;
        }

        if (resources[currentPlayer].food < cost.food || resources[currentPlayer].gold < cost.gold) {
            const messageElement = document.getElementById('message');
            messageElement.innerText = "Not enough resources to build this!";
            return;
        }

        resources[currentPlayer].food -= cost.food;
        resources[currentPlayer].gold -= cost.gold;
        resources[currentPlayer].food += gain.food;
        resources[currentPlayer].gold += gain.gold;

        board[row][col] = { player: currentPlayer, building: selectedBuilding };

        if (selectedBuilding === BUILDINGS.MILITARY) {
            updateMilitaryZone(row, col);
        }

        updateBoard();
        endTurn();
        checkWinCondition();
    }

    function updateMilitaryZone(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        militaryZones[row][col] = currentPlayer;
        directions.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            if (isValidCell(newRow, newCol)) {
                militaryZones[newRow][newCol] = currentPlayer;
            }
        });
    }

    function isValidCell(row, col) {
        return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
    }

    function updateResources() {
        document.getElementById('red-resources').textContent = `Red: ${resources[0].food} Food, ${resources[0].gold} Gold`;
        document.getElementById('blue-resources').textContent = `Blue: ${resources[1].food} Food, ${resources[1].gold} Gold`;
    }

    function updateBuildButtons() {
        const buttons = document.querySelectorAll('.build-button');
        buttons[1].disabled = resources[currentPlayer].food < 1; // Mining Camp
        buttons[2].disabled = resources[currentPlayer].food < 2 || resources[currentPlayer].gold < 2; // Military
    }

    function skipTurn() {
        endTurn();
    }

    function endTurn() {
        switchPlayer();
        const messageElement = document.getElementById('message');
        messageElement.innerText = "";
        turn++;
        document.getElementById('turn-number').textContent = turn;
        selectedBuilding = null;
    }

    function switchPlayer() {
        currentPlayer = 1 - currentPlayer;
        const playerNameElement = document.getElementById('player-name');
        playerNameElement.textContent = PLAYERS[currentPlayer];
        playerNameElement.className = `${PLAYERS[currentPlayer].toLowerCase()}-text`;
        updateBuildButtons();
    }

    function checkWinCondition() {
        const occupiedCells = board.flat().filter(cell => cell !== null).length;
        if (occupiedCells === BOARD_SIZE * BOARD_SIZE) {
            const winner = resources[0].food > resources[1].food ? 'Red' : (resources[1].food > resources[0].food ? 'Blue' : 'It\'s a tie no one');
            const messageElement = document.getElementById('message');
            messageElement.innerHTML = `Game Over! ${winner} wins with the most food!`;
            document.getElementById('restart-button').style.display = 'inline-block';
            document.getElementById('skip-turn-button').style.display = 'none';
        }
    }

    function restartGame() {
        board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
        militaryZones = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
        currentPlayer = 0;
        resources = [
            { food: 0, gold: 0 },
            { food: 0, gold: 0 }
        ];
        selectedBuilding = null;
        turn = 1;
        updateBoard();
        document.getElementById('message').textContent = '';
        document.getElementById('player-name').textContent = PLAYERS[currentPlayer];
        document.getElementById('player-name').className = `${PLAYERS[currentPlayer].toLowerCase()}-text`;
        document.getElementById('turn-number').textContent = turn;
        document.getElementById('restart-button').style.display = 'none';
        document.getElementById('skip-turn-button').style.display = 'inline-block';
    }

    // Wait for the DOM to be fully loaded before initializing the game
    document.addEventListener('DOMContentLoaded', function() {
        createBoard();
        updateBoard();
    });
</script>
</body>
</html>
```

### Explanation:

1. `createBoard()` generates the 6x6 grid and attaches click event listeners to each cell.
2. `updateBoard()` refreshes the visual state of the board, including building placements and military zones.
3. `selectBuilding(building)` sets the currently selected building type for placement.
4. `handleCellClick(row, col)` manages the logic for placing a building, including resource checks and military zone restrictions.
5. `updateMilitaryZone(row, col)` updates the controlled cells around a newly placed military building.
6. `updateResources()` refreshes the display of each player's resources.
7. `updateBuildButtons()` enables or disables building buttons based on the current player's resources.
8. `skipTurn()` allows a player to pass their turn without placing a building.
9. `endTurn()` switches to the next player and updates the turn count.
10. `checkWinCondition()` verifies if the game has ended and determines the winner based on food count.
11. `restartGame()` resets the game state to allow for a new game.

The game 'Micro Civ' offers a rich, strategic experience in a simple package. It uses emojis for buildings and colored players' pieces for easy distinction. To win, players should focus on efficient resource allocation, strategic building placement, and timely use of military structures.  