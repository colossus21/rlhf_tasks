### Code Plan:

1. UI:
    - Create a game container.
    - Add an item reference list (11 items mentioned).
    - Create player sections with inventories.
    - Add dice and control buttons.
    - Add animations on rice rolls and upon receiving item, add feedback on turn change by highlighting the current player. 

2. Gameplay Elements:
    - Implement dice rolling function.
    - Create item assignment logic and manage player turns.
    - Calculate scores based on player's inventory and determine winner.
    - Add restart functionality.

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mythical Item Collector</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f0f0f1;
            font-family: Arial, sans-serif;
        }
        #game-container {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            width: 100%;
        }
        .player-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .player {
            text-align: center;
            width: 45%;
            padding: 10px;
            border-radius: 5px;
        }
        #player1 { background-color: rgba(0, 0, 255, 0.1); }
        #player2 { background-color: rgba(255, 0, 0, 0.1); }
        .inventory {
            display: flex;
            justify-content: center;
            margin-top: 10px;
        }
        .inventory-slot {
            width: 40px;
            height: 40px;
            border: 1px solid #000;
            margin: 0 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            background-color: white;
        }
        #dice-container {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }
        .dice {
            width: 60px;
            height: 60px;
            background-color: white;
            border: 2px solid #000;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            font-weight: bold;
            margin: 0 10px;
        }
        #roll-button, #restart-button {
            padding: 10px 20px;
            font-size: 18px;
            cursor: pointer;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        #roll-button:hover, #restart-button:hover {
            background-color: #2980b9;
        }
        #status {
            font-size: 18px;
            margin-top: 20px;
            font-weight: bold;
            color: #2c3e50;
            height: 50px;
        }
        #item-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
            text-align: left;
        }
        .item {
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        @keyframes roll {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes highlight {
            0% { background-color: yellow; }
            100% { background-color: transparent; }
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
        }
        .highlight { animation: highlight 2s ease-in-out; }
        .bounce { animation: bounce 0.5s ease-in-out; }
        .active-player { box-shadow: 0 0 10px 5px rgba(173, 216, 230, 0.7); }
    </style>
</head>
<body>
<div id="game-container">
    <h1>Mythical Item Collector</h1>
    <div id="item-list"></div>
    <div class="player-section">
        <div class="player" id="player1">
            <h2 style="color: blue;">Player 1</h2>
            <div class="inventory" id="player1-inventory">
                <div class="inventory-slot"></div>
                <div class="inventory-slot"></div>
                <div class="inventory-slot"></div>
                <div class="inventory-slot"></div>
                <div class="inventory-slot"></div>
            </div>
            <div id="player1-score"></div>
        </div>
        <div class="player" id="player2">
            <h2 style="color: red;">Player 2</h2>
            <div class="inventory" id="player2-inventory">
                <div class="inventory-slot"></div>
                <div class="inventory-slot"></div>
                <div class="inventory-slot"></div>
                <div class="inventory-slot"></div>
                <div class="inventory-slot"></div>
            </div>
            <div id="player2-score"></div>
        </div>
    </div>
    <div id="dice-container">
        <div class="dice" id="dice1">1</div>
        <div class="dice" id="dice2">1</div>
    </div>
    <button id="roll-button">Roll Dice</button>
    <button id="restart-button" style="display: none;">Restart Game</button>
    <div id="status"></div>
</div>

<script>
    const items = {
        2: { name: "Excalibur", symbol: "⚔️", value: 8500 },
        3: { name: "Phoenix Feather", symbol: "🪶", value: 5000 },
        4: { name: "Midas Touch Glove", symbol: "🧤", value: 7500 },
        5: { name: "Ankh of Immortality", symbol: "☥", value: 9500 },
        6: { name: "Cloak of Invisibility", symbol: "🧥", value: 9000 },
        7: { name: "Pandora's Box", symbol: "📦", value: 4500 },
        8: { name: "Golden Fleece", symbol: "🐑", value: 7000 },
        9: { name: "Mjölnir", symbol: "🔨", value: 8000 },
        10: { name: "Aladdin's Lamp", symbol: "🪔", value: 6500 },
        11: { name: "Ambrosia Chalice", symbol: "🏆", value: 5500 },
        12: { name: "Philosopher's Stone", symbol: "💎", value: 10000 }
    };

    let currentPlayer = 1;
    let roundCount = 0;
    const playerInventories = {
        1: [],
        2: []
    };

    function updateStatus(message) {
        const statusElement = document.getElementById('status');
        statusElement.textContent = message;
        statusElement.classList.add('bounce');
        setTimeout(() => statusElement.classList.remove('bounce'), 500);
    }

    function populateItemList() {
        const itemList = document.getElementById('item-list');
        for (let [sum, item] of Object.entries(items)) {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.id = `item-${sum}`;
            itemElement.textContent = `${sum}: ${item.symbol} ${item.name} (${item.value} gold)`;
            itemList.appendChild(itemElement);
        }
    }

    function rollDice() {
        const dice1 = document.getElementById('dice1');
        const dice2 = document.getElementById('dice2');
        const rollButton = document.getElementById('roll-button');

        rollButton.disabled = true;
        dice1.style.animation = 'roll 0.5s linear';
        dice2.style.animation = 'roll 0.5s linear';

        setTimeout(() => {
            dice1.style.animation = 'none';
            dice2.style.animation = 'none';

            const roll1 = Math.floor(Math.random() * 6) + 1;
            const roll2 = Math.floor(Math.random() * 6) + 1;
            const sum = roll1 + roll2;

            dice1.textContent = roll1;
            dice2.textContent = roll2;

            const item = items[sum];
            if (item) {
                playerInventories[currentPlayer].push(item);
                updateInventoryDisplay();
                updateStatus(`Player ${currentPlayer} rolled ${sum} and got ${item.name}!`);
                highlightItem(sum);
            } else {
                updateStatus(`Player ${currentPlayer} rolled ${sum}. No item for this number.`);
            }

            switchPlayer();
            roundCount++;

            if (roundCount >= 10) {
                endGame();
            } else {
                rollButton.disabled = false;
                updateStatus(`Player ${currentPlayer}'s turn`);
            }
        }, 500);
    }

    function updateInventoryDisplay() {
        for (let player = 1; player <= 2; player++) {
            const inventory = document.getElementById(`player${player}-inventory`);
            const slots = inventory.getElementsByClassName('inventory-slot');

            playerInventories[player].forEach((item, index) => {
                if (index < slots.length) {
                    slots[index].textContent = item.symbol;
                    slots[index].classList.add('bounce');
                    setTimeout(() => slots[index].classList.remove('bounce'), 500);
                }
            });
        }
    }

    function switchPlayer() {
        document.getElementById(`player${currentPlayer}`).classList.remove('active-player');
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        document.getElementById(`player${currentPlayer}`).classList.add('active-player');
    }

    function highlightItem(sum) {
        const itemElement = document.getElementById(`item-${sum}`);
        if (itemElement) {
            itemElement.classList.add('highlight');
            setTimeout(() => itemElement.classList.remove('highlight'), 2000);
        }
    }

    function calculateScore(playerInventory) {
        return playerInventory.reduce((total, item) => total + item.value, 0);
    }

    function endGame() {
        const rollButton = document.getElementById('roll-button');
        const restartButton = document.getElementById('restart-button');
        rollButton.style.display = 'none';
        restartButton.style.display = 'inline-block';

        const score1 = calculateScore(playerInventories[1]);
        const score2 = calculateScore(playerInventories[2]);

        document.getElementById('player1-score').textContent = `Score: ${score1} gold`;
        document.getElementById('player2-score').textContent = `Score: ${score2} gold`;

        if (score1 > score2) {
            updateStatus("Player 1 wins!");
        } else if (score2 > score1) {
            updateStatus("Player 2 wins!");
        } else {
            updateStatus("It's a tie!");
        }
    }

    function restartGame() {
        currentPlayer = 1;
        roundCount = 0;
        playerInventories[1] = [];
        playerInventories[2] = [];

        document.getElementById('roll-button').style.display = 'inline-block';
        document.getElementById('restart-button').style.display = 'none';

        document.getElementById('player1-score').textContent = '';
        document.getElementById('player2-score').textContent = '';

        const inventorySlots = document.querySelectorAll('.inventory-slot');
        inventorySlots.forEach(slot => slot.textContent = '');

        document.getElementById('player2').classList.remove('active-player');
        document.getElementById('player1').classList.add('active-player');

        updateStatus("Player 1's turn");
    }

    document.getElementById('roll-button').addEventListener('click', rollDice);
    document.getElementById('restart-button').addEventListener('click', restartGame);
    populateItemList();
    document.getElementById('player1').classList.add('active-player');
    updateStatus("Player 1's turn");
</script>
</body>
</html>
```

### Explanation:

1. UI:
   1. Displays all items with symbols, names, and values.
   2. Shows each player's name, inventory (5 slots), and score.
   3. Two dice representations and a roll button are added.
   4. Shows current turn and game messages.
   5. Restart Button appears after game ends.

2. Gameplay Flow:
   1. Initialize game state and display.
   2. Players take turns rolling dice:
       - Highlights active player.
       - Rolls dice, determine item.
       - Updates inventory with animation.
       - Highlights the received item in the reference list.
   3. Ends the game after 5 rounds (10 turns total).
   4. Calculate scores, declare winner, show restart button.
   5. Restart button resets game to initial state.

The "Mythical Item Collector" game can provide a fun and engaging turn-based experience to board game enthusiasts.  