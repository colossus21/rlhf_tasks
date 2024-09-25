### Code Plan:

UI Components:
1. Game container
2. Player information panels
    - Player name
    - Score
    - Seed inventory (Spinach, Carrot, Pumpkin)
    - Water Card count
3. Game board (6x6 grid)
4. Action buttons
    - Roll Dice
    - End Turn
5. Game information display
6. Restart button (hidden until game ends)

Game Logic:
1. Initialize game state
2. Implement turn-based gameplay
3. Dice rolling and reward distribution
4. Crop planting
5. Crop watering
6. Automatic harvesting
7. Score tracking
8. Win condition check
9. Game reset functionality

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Harvest Haven</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #8BC34A;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><path fill="%23689F38" d="M0 0h80v80H0z"/><circle cx="40" cy="40" r="30" fill="%238BC34A"/></svg>');
            padding: 20px;
        }
        #game-container {
            text-align: center;
            background-color: #FFF8E1;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            max-width: 800px;
            width: 100%;
        }
        h1 {
            color: #33691E;
            font-size: 2.5em;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        #game-board {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 5px;
            margin-bottom: 20px;
            background-color: #795548;
            padding: 10px;
            border-radius: 10px;
        }
        .space {
            width: 60px;
            height: 60px;
            border: 2px solid #5D4037;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            position: relative;
            transition: all 0.3s ease;
            cursor: pointer;
            border-radius: 5px;
        }
        .space:hover {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        .space .emoji {
            font-size: 30px;
        }
        .space .caption {
            font-size: 10px;
            margin-top: 2px;
            background-color: rgba(255,255,255,0.7);
            padding: 2px 4px;
            border-radius: 3px;
        }
        .player1-space { background-color: #FFCDD2; }
        .player2-space { background-color: #BBDEFB; }
        button {
            font-size: 16px;
            padding: 10px 20px;
            margin: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        button:hover {
            background-color: #45a049;
        }
        button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        #game-info {
            margin-top: 20px;
            font-size: 18px;
            background-color: #DCEDC8;
            padding: 15px;
            border-radius: 10px;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
            color: #33691E;
        }
        .player-info {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
        }
        .player-card {
            background-color: #E8F5E9;
            padding: 15px;
            border-radius: 10px;
            width: 45%;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .current-player {
            border: 3px solid #4CAF50;
        }
        .crop-button, .water-button {
            font-size: 24px;
            padding: 5px 10px;
            margin: 5px;
            background-color: #FFE082;
            border: 2px solid #FFA000;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .crop-button:hover, .water-button:hover {
            background-color: #FFD54F;
            transform: scale(1.05);
        }
        .selected {
            background-color: #FFA000;
            color: white;
        }
        @keyframes harvest {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.5; }
            100% { transform: scale(0); opacity: 0; }
        }
        .harvesting {
            animation: harvest 0.5s ease-out;
        }
    </style>
</head>
<body>
<div id="game-container">
    <h1>🌾 Harvest Haven 🌾</h1>
    <div class="player-info">
        <div id="player1-info" class="player-card">
            <h3>Farmer Red</h3>
            <p>Points: <span id="player1-points">0</span></p>
            <div>
                <button class="crop-button" data-player="1" data-crop="Spinach">🥬</button>
                <button class="crop-button" data-player="1" data-crop="Carrot">🥕</button>
                <button class="crop-button" data-player="1" data-crop="Pumpkin">🎃</button>
                <button class="water-button" data-player="1">💧 x <span id="player1-water">0</span></button>
            </div>
        </div>
        <div id="player2-info" class="player-card">
            <h3>Farmer Blue</h3>
            <p>Points: <span id="player2-points">0</span></p>
            <div>
                <button class="crop-button" data-player="2" data-crop="Spinach">🥬</button>
                <button class="crop-button" data-player="2" data-crop="Carrot">🥕</button>
                <button class="crop-button" data-player="2" data-crop="Pumpkin">🎃</button>
                <button class="water-button" data-player="2">💧 x <span id="player2-water">0</span></button>
            </div>
        </div>
    </div>
    <div id="game-board"></div>
    <button id="roll-dice">Roll Dice</button>
    <button id="end-turn" disabled>End Turn</button>
    <div id="game-info"></div>
</div>

<script>
    const crops = [
        { emoji: '🥬', name: "Spinach", waterNeeded: 1, points: 1 },
        { emoji: '🥕', name: "Carrot", waterNeeded: 2, points: 2 },
        { emoji: '🎃', name: "Pumpkin", waterNeeded: 3, points: 6 }
    ];

    const diceRewards = [
        { emoji: '💧', name: "Water Card", amount: 1 },
        { emoji: '💧', name: "Water Card", amount: 2 },
        { emoji: '💧', name: "Water Card", amount: 3 },
        { emoji: '🥬', name: "Spinach Seed", amount: 1 },
        { emoji: '🥕', name: "Carrot Seed", amount: 1 },
        { emoji: '🎃', name: "Pumpkin Seed", amount: 1 }
    ];

    const players = [
        { name: "Farmer Red", points: 0, water: 0, seeds: { Spinach: 0, Carrot: 0, Pumpkin: 0 } },
        { name: "Farmer Blue", points: 0, water: 0, seeds: { Spinach: 0, Carrot: 0, Pumpkin: 0 } }
    ];

    let currentPlayer = 0;
    let gameEnded = false;
    let selectedCrop = null;
    let wateringMode = false;
    let actionTaken = false;

    function createGameBoard() {
        const gameBoard = document.getElementById('game-board');
        for (let i = 0; i < 36; i++) {
            const space = document.createElement('div');
            space.className = 'space';
            space.dataset.index = i;

            // Determine which player's space this is
            if (i < 18) {
                space.classList.add('player1-space');
            } else {
                space.classList.add('player2-space');
            }

            space.addEventListener('click', () => handleSpaceClick(i));
            gameBoard.appendChild(space);
        }
    }

    function handleSpaceClick(index) {
        if (gameEnded || actionTaken) return;

        const player = players[currentPlayer];
        const space = document.querySelectorAll('.space')[index];

        // Check if the clicked space belongs to the current player
        if ((currentPlayer === 0 && !space.classList.contains('player1-space')) ||
            (currentPlayer === 1 && !space.classList.contains('player2-space'))) {
            updateGameInfo("You can only interact with your own fields.");
            return;
        }

        if (wateringMode) {
            waterCrop(space, player);
        } else if (selectedCrop) {
            plantCrop(space, player);
        }
    }

    function plantCrop(space, player) {
        if (space.querySelector('.emoji')) {
            updateGameInfo("This field is already occupied. Choose another field.");
            return;
        }

        if (player.seeds[selectedCrop] <= 0) {
            updateGameInfo(`You don't have any ${selectedCrop} seeds.`);
            return;
        }

        player.seeds[selectedCrop]--;
        const crop = crops.find(c => c.name === selectedCrop);
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'emoji';
        emojiSpan.textContent = crop.emoji;
        const captionSpan = document.createElement('span');
        captionSpan.className = 'caption';
        captionSpan.textContent = `0/${crop.waterNeeded}💧`;
        space.innerHTML = '';
        space.appendChild(emojiSpan);
        space.appendChild(captionSpan);
        space.dataset.crop = selectedCrop;
        space.dataset.water = 0;

        updatePlayerInfo();
        updateGameInfo(`${player.name} planted a ${selectedCrop}.`);
        selectedCrop = null;
        document.querySelectorAll('.crop-button').forEach(btn => btn.classList.remove('selected'));
        actionTaken = true;
        checkEndTurn();
    }

    function waterCrop(space, player) {
        const cropName = space.dataset.crop;
        if (!cropName) {
            updateGameInfo("There's no crop to water here.");
            return;
        }

        if (player.water <= 0) {
            updateGameInfo("You don't have any water cards.");
            return;
        }

        const crop = crops.find(c => c.name === cropName);
        const currentWater = parseInt(space.dataset.water);

        if (currentWater >= crop.waterNeeded) {
            updateGameInfo("This crop is already fully watered.");
            return;
        }

        player.water--;
        space.dataset.water = currentWater + 1;
        space.querySelector('.caption').textContent = `${currentWater + 1}/${crop.waterNeeded}💧`;

        if (parseInt(space.dataset.water) === crop.waterNeeded) {
            harvestCrop(space, player, crop);
        } else {
            updateGameInfo(`${player.name} watered the ${cropName}.`);
        }

        updatePlayerInfo();
        wateringMode = false;
        document.querySelectorAll('.water-button').forEach(btn => btn.classList.remove('selected'));
        actionTaken = true;
        checkEndTurn();
    }

    function harvestCrop(space, player, crop) {
        space.classList.add('harvesting');
        setTimeout(() => {
            player.points += crop.points;
            updateGameInfo(`${player.name} harvested a ${crop.name} and gained ${crop.points} points!`);
            space.innerHTML = '';
            space.dataset.crop = '';
            space.dataset.water = '';
            space.classList.remove('harvesting');

            updatePlayerInfo();

            if (player.points >= 20) {
                endGame(player);
            }
        }, 500);
    }

    function rollDice() {
        return Math.floor(Math.random() * 6);
    }

    function updateGameInfo(message) {
        document.getElementById('game-info').innerHTML = message;
    }

    function updatePlayerInfo() {
        for (let i = 0; i < 2; i++) {
            document.getElementById(`player${i+1}-points`).textContent = players[i].points;
            document.getElementById(`player${i+1}-water`).textContent = players[i].water;
            document.getElementById(`player${i+1}-info`).classList.toggle('current-player', i === currentPlayer);
            ['Spinach', 'Carrot', 'Pumpkin'].forEach(crop => {
                const btn = document.querySelector(`.crop-button[data-player="${i+1}"][data-crop="${crop}"]`);
                btn.textContent = `${crops.find(c => c.name === crop).emoji} x${players[i].seeds[crop]}`;
            });
        }
    }

    function checkEndTurn() {
        document.getElementById('end-turn').disabled = false;
    }

    function endTurn() {
        currentPlayer = (currentPlayer + 1) % 2;
        updatePlayerInfo();
        document.getElementById('roll-dice').disabled = false;
        document.getElementById('end-turn').disabled = true;
        selectedCrop = null;
        wateringMode = false;
        actionTaken = false;
        document.querySelectorAll('.crop-button, .water-button').forEach(btn => btn.classList.remove('selected'));
        updateGameInfo(`${players[currentPlayer].name}'s turn. Roll the dice!`);

        // Disable action buttons for the previous player
        document.querySelectorAll(`.crop-button[data-player="${(currentPlayer === 0 ? 2 : 1)}"], .water-button[data-player="${(currentPlayer === 0 ? 2 : 1)}"]`).forEach(btn => btn.disabled = true);

        // Enable action buttons for the current player
        document.querySelectorAll(`.crop-button[data-player="${currentPlayer + 1}"], .water-button[data-player="${currentPlayer + 1}"]`).forEach(btn => btn.disabled = false);

        // Check if any crops are ready for harvest
        checkForHarvest();
    }

    function checkForHarvest() {
        const spaces = document.querySelectorAll('.space');
        spaces.forEach(space => {
            const cropName = space.dataset.crop;
            if (cropName) {
                const crop = crops.find(c => c.name === cropName);
                const currentWater = parseInt(space.dataset.water);
                if (currentWater === crop.waterNeeded) {
                    const player = players[space.classList.contains('player1-space') ? 0 : 1];
                    harvestCrop(space, player, crop);
                }
            }
        });
    }

    function endGame(winner) {
        gameEnded = true;
        updateGameInfo(`Game Over! ${winner.name} wins with ${winner.points} points!`);
        document.getElementById('roll-dice').disabled = true;
        document.getElementById('end-turn').disabled = true;

        // Create and add the restart button
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.addEventListener('click', restartGame);
        document.getElementById('game-container').appendChild(restartButton);
    }

    function restartGame() {
        // Reset game state
        gameEnded = false;
        currentPlayer = 0;
        selectedCrop = null;
        wateringMode = false;
        actionTaken = false;

        // Reset players
        players.forEach(player => {
            player.points = 0;
            player.water = 0;
            player.seeds = { Spinach: 0, Carrot: 0, Pumpkin: 0 };
        });

        // Clear the game board
        const spaces = document.querySelectorAll('.space');
        spaces.forEach(space => {
            space.innerHTML = '';
            space.dataset.crop = '';
            space.dataset.water = '';
        });

        // Remove the restart button
        const restartButton = document.querySelector('button:last-child');
        if (restartButton) {
            restartButton.remove();
        }

        // Reset UI
        document.getElementById('roll-dice').disabled = false;
        document.getElementById('end-turn').disabled = true;
        document.querySelectorAll('.crop-button, .water-button').forEach(btn => btn.classList.remove('selected'));

        // Disable Player 2's buttons at the start
        document.querySelectorAll('.crop-button[data-player="2"], .water-button[data-player="2"]').forEach(btn => btn.disabled = true);
        document.querySelectorAll('.crop-button[data-player="1"], .water-button[data-player="1"]').forEach(btn => btn.disabled = false);

        // Update game info and player info
        updateGameInfo("Game restarted! Farmer Red's turn. Roll the dice!");
        updatePlayerInfo();
    }

    document.getElementById('roll-dice').addEventListener('click', () => {
        if (gameEnded) return;

        const roll = rollDice();
        const reward = diceRewards[roll];
        const player = players[currentPlayer];

        if (reward.name === "Water Card") {
            player.water += reward.amount;
        } else {
            player.seeds[reward.name.split(' ')[0]] += reward.amount;
        }

        updateGameInfo(
            `${player.name} rolled a ${roll + 1}.<br>
                Reward: ${reward.emoji} ${reward.name} x${reward.amount}`
        );

        updatePlayerInfo();
        document.getElementById('roll-dice').disabled = true;
        checkEndTurn(); // Add this line to check if the turn can be ended
    });

    document.getElementById('end-turn').addEventListener('click', endTurn);

    document.querySelectorAll('.crop-button').forEach(button => {
        button.addEventListener('click', () => {
            if (parseInt(button.dataset.player) - 1 !== currentPlayer || actionTaken) return;
            selectedCrop = button.dataset.crop;
            wateringMode = false;
            document.querySelectorAll('.crop-button, .water-button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            updateGameInfo(`Select a field to plant your ${selectedCrop}.`);
        });
    });

    document.querySelectorAll('.water-button').forEach(button => {
        button.addEventListener('click', () => {
            if (parseInt(button.dataset.player) - 1 !== currentPlayer || actionTaken) return;
            if (players[currentPlayer].water <= 0) {
                updateGameInfo("You don't have any water cards.");
                return;
            }
            wateringMode = true;
            selectedCrop = null;
            document.querySelectorAll('.crop-button, .water-button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            updateGameInfo("Select a crop to water.");
        });
    });

    createGameBoard();
    updateGameInfo("Game started! Farmer Red's turn. Roll the dice!");
    updatePlayerInfo();
</script>
</body>
</html>
```

### Explanation:

- The game is designed for two players, Farmer Red and Farmer Blue, competing on a 6x6 grid board.
- Each player has a designated 3x3 area on the board, visually distinguished by color.
- Players manage three types of crops (Spinach, Carrot, Pumpkin) and Water Cards.
- The game uses emojis to represent crops and water, enhancing visual appeal.
- Turn-based gameplay is implemented, with players rolling dice to gain resources.
- Players can perform one action per turn: either planting a crop or watering an existing crop.
- Crops require different amounts of water to harvest, adding strategic depth.
- Automatic harvesting occurs when crops are fully watered, with accompanying animations.
- The game tracks scores in real-time, updating immediately after harvests.
- A win condition of 20 points determines the game's end.
- The user interface clearly displays player information, game state, and available actions.
- A restart button appears at the end of the game, allowing for easy replay.

This design creates an engaging, visually appealing farming-themed board game that balances simplicity with strategic depth.