### Code Plan:

UI Components:
1. Game Board (Periodic Table)
    - Grid layout representing the periodic table
    - Each cell contains an element's symbol and atomic number
    - Color-coded cells based on element groups
    - Player tokens visible on the cells

2. Player Information Area
    - Display for Player 1 and Player 2
    - Shows current points for each player
    - Highlights the current player's turn

3. Game Controls
    - "Roll Dice" button
    - "Restart Game" button (hidden until game ends)

4. Game Information Section
    - Displays roll results, player movements, and point changes
    - Shows game status (e.g., game start, player turns, game end)

5. Winner Display (shown after game ends)
    - Announces the winner and their final score

Gameplay Flow:
1. Game Initialization
    - Set up the periodic table grid with at least 90 elements
    - Initialize player positions and scores
    - Display initial game information

2. Turn Mechanism
    - Alternate between Player 1 and Player 2
    - Highlight the current player's information

3. Dice Rolling and Movement
    - Player clicks "Roll Dice" button
    - Generate a random number (1-6)
    - Move the player's token on the board
    - Update player's position and score

4. Scoring System
    - Award points equal to the atomic number of the landed element
    - Update and display the new score

5. Game Progress Tracking
    - Check if a player has reached the end of the table
    - Allow the other player to continue if they haven't finished

6. End Game Condition
    - Trigger when both players reach the last element
    - Display the winner based on the highest score
    - Show the "Restart Game" button

7. Game Reset
    - Reset player positions and scores
    - Clear the board and reinitialize the game state

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Periodic Table Dash</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
        }
        .player-token {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            position: absolute;
            bottom: 2px;
            transition: all 0.3s ease;
        }
        .player1 { background-color: #ef4444; right: 2px; }
        .player2 { background-color: #3b82f6; left: 2px; }
        .current-player { box-shadow: 0 0 0 2px #10b981; }
        .element-space { transition: all 0.2s ease; }
        .element-space:hover { transform: scale(1.05); z-index: 10; }
    </style>
</head>
<body class="bg-gray-100 flex justify-center items-center min-h-screen p-4">
<div id="game-container" class="bg-white rounded-lg shadow-lg p-6 max-w-7xl w-full">
    <h1 class="text-4xl font-bold mb-6 text-center text-gray-800">Periodic Table Dash</h1>
    <div class="flex justify-around mb-6">
        <div id="player1-info" class="bg-gray-200 rounded p-4 w-1/3">
            <h3 class="text-lg font-semibold">Player 1</h3>
            <p>Points: <span id="player1-points">0</span></p>
        </div>
        <div id="player2-info" class="bg-gray-200 rounded p-4 w-1/3">
            <h3 class="text-lg font-semibold">Player 2</h3>
            <p>Points: <span id="player2-points">0</span></p>
        </div>
    </div>
    <div id="game-board" class="grid gap-1 mb-6"></div>
    <div class="flex justify-center">
        <button id="roll-dice" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">
            Roll Dice
        </button>
        <button id="restart-game" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded hidden">
            Restart Game
        </button>
    </div>
    <div id="game-info" class="mt-6 text-lg bg-gray-200 p-4 rounded max-w-2xl mx-auto"></div>
</div>

<script>
    const elements = [
        { symbol: 'H', name: 'Hydrogen', number: 1, group: 'bg-green-200' },
        { symbol: 'He', name: 'Helium', number: 2, group: 'bg-purple-200' },
        { symbol: 'Li', name: 'Lithium', number: 3, group: 'bg-red-200' },
        { symbol: 'Be', name: 'Beryllium', number: 4, group: 'bg-orange-200' },
        { symbol: 'B', name: 'Boron', number: 5, group: 'bg-yellow-200' },
        { symbol: 'C', name: 'Carbon', number: 6, group: 'bg-green-200' },
        { symbol: 'N', name: 'Nitrogen', number: 7, group: 'bg-green-200' },
        { symbol: 'O', name: 'Oxygen', number: 8, group: 'bg-green-200' },
        { symbol: 'F', name: 'Fluorine', number: 9, group: 'bg-yellow-300' },
        { symbol: 'Ne', name: 'Neon', number: 10, group: 'bg-purple-200' },
        { symbol: 'Na', name: 'Sodium', number: 11, group: 'bg-red-200' },
        { symbol: 'Mg', name: 'Magnesium', number: 12, group: 'bg-orange-200' },
        { symbol: 'Al', name: 'Aluminum', number: 13, group: 'bg-blue-200' },
        { symbol: 'Si', name: 'Silicon', number: 14, group: 'bg-yellow-200' },
        { symbol: 'P', name: 'Phosphorus', number: 15, group: 'bg-green-200' },
        { symbol: 'S', name: 'Sulfur', number: 16, group: 'bg-green-200' },
        { symbol: 'Cl', name: 'Chlorine', number: 17, group: 'bg-yellow-300' },
        { symbol: 'Ar', name: 'Argon', number: 18, group: 'bg-purple-200' },
        { symbol: 'K', name: 'Potassium', number: 19, group: 'bg-red-200' },
        { symbol: 'Ca', name: 'Calcium', number: 20, group: 'bg-orange-200' },
        { symbol: 'Sc', name: 'Scandium', number: 21, group: 'bg-pink-200' },
        { symbol: 'Ti', name: 'Titanium', number: 22, group: 'bg-pink-200' },
        { symbol: 'V', name: 'Vanadium', number: 23, group: 'bg-pink-200' },
        { symbol: 'Cr', name: 'Chromium', number: 24, group: 'bg-pink-200' },
        { symbol: 'Mn', name: 'Manganese', number: 25, group: 'bg-pink-200' },
        { symbol: 'Fe', name: 'Iron', number: 26, group: 'bg-pink-200' },
        { symbol: 'Co', name: 'Cobalt', number: 27, group: 'bg-pink-200' },
        { symbol: 'Ni', name: 'Nickel', number: 28, group: 'bg-pink-200' },
        { symbol: 'Cu', name: 'Copper', number: 29, group: 'bg-pink-200' },
        { symbol: 'Zn', name: 'Zinc', number: 30, group: 'bg-pink-200' },
        { symbol: 'Ga', name: 'Gallium', number: 31, group: 'bg-blue-200' },
        { symbol: 'Ge', name: 'Germanium', number: 32, group: 'bg-yellow-200' },
        { symbol: 'As', name: 'Arsenic', number: 33, group: 'bg-yellow-200' },
        { symbol: 'Se', name: 'Selenium', number: 34, group: 'bg-green-200' },
        { symbol: 'Br', name: 'Bromine', number: 35, group: 'bg-yellow-300' },
        { symbol: 'Kr', name: 'Krypton', number: 36, group: 'bg-purple-200' },
        { symbol: 'Rb', name: 'Rubidium', number: 37, group: 'bg-red-200' },
        { symbol: 'Sr', name: 'Strontium', number: 38, group: 'bg-orange-200' },
        { symbol: 'Y', name: 'Yttrium', number: 39, group: 'bg-pink-200' },
        { symbol: 'Zr', name: 'Zirconium', number: 40, group: 'bg-pink-200' },
        { symbol: 'Nb', name: 'Niobium', number: 41, group: 'bg-pink-200' },
        { symbol: 'Mo', name: 'Molybdenum', number: 42, group: 'bg-pink-200' },
        { symbol: 'Tc', name: 'Technetium', number: 43, group: 'bg-pink-200' },
        { symbol: 'Ru', name: 'Ruthenium', number: 44, group: 'bg-pink-200' },
        { symbol: 'Rh', name: 'Rhodium', number: 45, group: 'bg-pink-200' },
        { symbol: 'Pd', name: 'Palladium', number: 46, group: 'bg-pink-200' },
        { symbol: 'Ag', name: 'Silver', number: 47, group: 'bg-pink-200' },
        { symbol: 'Cd', name: 'Cadmium', number: 48, group: 'bg-pink-200' },
        { symbol: 'In', name: 'Indium', number: 49, group: 'bg-blue-200' },
        { symbol: 'Sn', name: 'Tin', number: 50, group: 'bg-blue-200' },
        { symbol: 'Sb', name: 'Antimony', number: 51, group: 'bg-yellow-200' },
        { symbol: 'Te', name: 'Tellurium', number: 52, group: 'bg-yellow-200' },
        { symbol: 'I', name: 'Iodine', number: 53, group: 'bg-yellow-300' },
        { symbol: 'Xe', name: 'Xenon', number: 54, group: 'bg-purple-200' },
        { symbol: 'Cs', name: 'Cesium', number: 55, group: 'bg-red-200' },
        { symbol: 'Ba', name: 'Barium', number: 56, group: 'bg-orange-200' },
        { symbol: 'La', name: 'Lanthanum', number: 57, group: 'bg-indigo-200' },
        { symbol: 'Ce', name: 'Cerium', number: 58, group: 'bg-indigo-200' },
        { symbol: 'Pr', name: 'Praseodymium', number: 59, group: 'bg-indigo-200' },
        { symbol: 'Nd', name: 'Neodymium', number: 60, group: 'bg-indigo-200' },
        { symbol: 'Pm', name: 'Promethium', number: 61, group: 'bg-indigo-200' },
        { symbol: 'Sm', name: 'Samarium', number: 62, group: 'bg-indigo-200' },
        { symbol: 'Eu', name: 'Europium', number: 63, group: 'bg-indigo-200' },
        { symbol: 'Gd', name: 'Gadolinium', number: 64, group: 'bg-indigo-200' },
        { symbol: 'Tb', name: 'Terbium', number: 65, group: 'bg-indigo-200' },
        { symbol: 'Dy', name: 'Dysprosium', number: 66, group: 'bg-indigo-200' },
        { symbol: 'Ho', name: 'Holmium', number: 67, group: 'bg-indigo-200' },
        { symbol: 'Er', name: 'Erbium', number: 68, group: 'bg-indigo-200' },
        { symbol: 'Tm', name: 'Thulium', number: 69, group: 'bg-indigo-200' },
        { symbol: 'Yb', name: 'Ytterbium', number: 70, group: 'bg-indigo-200' },
        { symbol: 'Lu', name: 'Lutetium', number: 71, group: 'bg-indigo-200' },
        { symbol: 'Hf', name: 'Hafnium', number: 72, group: 'bg-pink-200' },
        { symbol: 'Ta', name: 'Tantalum', number: 73, group: 'bg-pink-200' },
        { symbol: 'W', name: 'Tungsten', number: 74, group: 'bg-pink-200' },
        { symbol: 'Re', name: 'Rhenium', number: 75, group: 'bg-pink-200' },
        { symbol: 'Os', name: 'Osmium', number: 76, group: 'bg-pink-200' },
        { symbol: 'Ir', name: 'Iridium', number: 77, group: 'bg-pink-200' },
        { symbol: 'Pt', name: 'Platinum', number: 78, group: 'bg-pink-200' },
        { symbol: 'Au', name: 'Gold', number: 79, group: 'bg-pink-200' },
        { symbol: 'Hg', name: 'Mercury', number: 80, group: 'bg-pink-200' },
        { symbol: 'Tl', name: 'Thallium', number: 81, group: 'bg-blue-200' },
        { symbol: 'Pb', name: 'Lead', number: 82, group: 'bg-blue-200' },
        { symbol: 'Bi', name: 'Bismuth', number: 83, group: 'bg-blue-200' },
        { symbol: 'Po', name: 'Polonium', number: 84, group: 'bg-yellow-200' },
        { symbol: 'At', name: 'Astatine', number: 85, group: 'bg-yellow-300' },
        { symbol: 'Rn', name: 'Radon', number: 86, group: 'bg-purple-200' },
        { symbol: 'Fr', name: 'Francium', number: 87, group: 'bg-red-200' },
        { symbol: 'Ra', name: 'Radium', number: 88, group: 'bg-orange-200' },
        { symbol: 'Ac', name: 'Actinium', number: 89, group: 'bg-pink-300' },
        { symbol: 'Th', name: 'Thorium', number: 90, group: 'bg-pink-300' },
        { symbol: 'Pa', name: 'Protactinium', number: 91, group: 'bg-pink-300' },
        { symbol: 'U', name: 'Uranium', number: 92, group: 'bg-pink-300' },
        { symbol: 'Np', name: 'Neptunium', number: 93, group: 'bg-pink-300' },
        { symbol: 'Pu', name: 'Plutonium', number: 94, group: 'bg-pink-300' },
        { symbol: 'Am', name: 'Americium', number: 95, group: 'bg-pink-300' },
        { symbol: 'Cm', name: 'Curium', number: 96, group: 'bg-pink-300' },
        { symbol: 'Bk', name: 'Berkelium', number: 97, group: 'bg-pink-300' },
        { symbol: 'Cf', name: 'Californium', number: 98, group: 'bg-pink-300' },
        { symbol: 'Es', name: 'Einsteinium', number: 99, group: 'bg-pink-300' },
        { symbol: 'Fm', name: 'Fermium', number: 100, group: 'bg-pink-300' },
        { symbol: 'Md', name: 'Mendelevium', number: 101, group: 'bg-pink-300' },
        { symbol: 'No', name: 'Nobelium', number: 102, group: 'bg-pink-300' },
        { symbol: 'Lr', name: 'Lawrencium', number: 103, group: 'bg-pink-300' },
        { symbol: 'Rf', name: 'Rutherfordium', number: 104, group: 'bg-pink-200' },
        { symbol: 'Db', name: 'Dubnium', number: 105, group: 'bg-pink-200' },
        { symbol: 'Sg', name: 'Seaborgium', number: 106, group: 'bg-pink-200' },
        { symbol: 'Bh', name: 'Bohrium', number: 107, group: 'bg-pink-200' },
        { symbol: 'Hs', name: 'Hassium', number: 108, group: 'bg-pink-200' },
        { symbol: 'Mt', name: 'Meitnerium', number: 109, group: 'bg-pink-200' },
        { symbol: 'Ds', name: 'Darmstadtium', number: 110, group: 'bg-pink-200' },
        { symbol: 'Rg', name: 'Roentgenium', number: 111, group: 'bg-pink-200' },
        { symbol: 'Cn', name: 'Copernicium', number: 112, group: 'bg-pink-200' },
        { symbol: 'Nh', name: 'Nihonium', number: 113, group: 'bg-blue-200' },
        { symbol: 'Fl', name: 'Flerovium', number: 114, group: 'bg-blue-200' },
        { symbol: 'Mc', name: 'Moscovium', number: 115, group: 'bg-blue-200' },
        { symbol: 'Lv', name: 'Livermorium', number: 116, group: 'bg-blue-200' },
        { symbol: 'Ts', name: 'Tennessine', number: 117, group: 'bg-yellow-300' },
        { symbol: 'Og', name: 'Oganesson', number: 118, group: 'bg-purple-200' }
    ];

    const players = [
        { name: "Player 1", position: 0, points: 0 },
        { name: "Player 2", position: 0, points: 0 }
    ];

    let currentPlayer = 0;
    let gameEnded = false;

    function createGameBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = ''; // Clear the board before creating new elements

        gameBoard.style.gridTemplateColumns = "repeat(18, minmax(50px, 1fr))";
        gameBoard.style.gridTemplateRows = "repeat(7, minmax(50px, 1fr))";

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 18; j++) {
                const space = document.createElement('div');
                space.className = 'element-space w-14 h-14 flex flex-col justify-center items-center text-xs font-bold relative border';

                const element = getElement(i, j);
                if (element) {
                    space.className += ` ${element.group}`;
                    space.innerHTML = `
                    <span class="absolute top-0.5 left-0.5 text-[0.6rem]">${element.number}</span>
                    <span class="text-sm">${element.symbol}</span>
                `;
                    space.title = `${element.name} (${element.symbol})`;
                } else {
                    space.className += ' invalid bg-gray-200';
                }

                gameBoard.appendChild(space);
            }
        }

        // Add initial player tokens
        const startSpace = gameBoard.firstElementChild;
        players.forEach((player, index) => {
            const token = document.createElement('div');
            token.className = `player-token player${index + 1}`;
            startSpace.appendChild(token);
        });
    }

    function movePlayerAndReturnElementName(player, spaces) {
        const oldPosition = player.position;
        player.position = Math.min(player.position + spaces, 89);
        return updatePlayerPosition(player, oldPosition);
    }

    function updatePlayerPosition(player, oldPosition) {
        const gameBoard = document.getElementById('game-board');
        let spaces = Array.from(gameBoard.children);
        spaces = spaces.filter(space => !space.classList.contains('invalid'));

        if (oldPosition >= 0 && oldPosition < spaces.length) {
            const oldToken = spaces[oldPosition].querySelector(`.player${currentPlayer + 1}`);
            if (oldToken) oldToken.remove();
        }

        if (player.position >= 0 && player.position < spaces.length) {
            const newSpace = spaces[player.position];
            const elementSymbol = newSpace.querySelector('span.text-sm');
            const existingToken = newSpace.querySelector(`.player${currentPlayer + 1}`);
            if (!existingToken) {
                const newToken = document.createElement('div');
                newToken.className = `player-token player${currentPlayer + 1}`;
                newSpace.appendChild(newToken);
            }
            return elementSymbol.textContent
        }

        return ""
    }

    function endTurn() {
        if (players.every(p => p.position === 89)) {
            endGame();
        } else {
            currentPlayer = (currentPlayer + 1) % players.length;
            updatePlayerInfo();
        }
    }

    function updateGameInfo(message) {
        const gameInfo = document.getElementById('game-info');
        gameInfo.innerHTML = message;
        gameInfo.style.display = 'block';
    }

    function updatePlayerInfo() {
        players.forEach((player, index) => {
            const infoElement = document.getElementById(`player${index + 1}-info`);
            infoElement.querySelector('p').textContent = `Points: ${player.points}`;
            infoElement.classList.toggle('current-player', index === currentPlayer);
        });
        document.getElementById('roll-dice').textContent = `Roll Dice (${players[currentPlayer].name})`;
    }

    function getElement(row, col) {
        const elementsMap = {
            "0-0": 0,   // H
            "0-17": 1,  // He
            "1-0": 2,   // Li
            "1-1": 3,   // Be
            "1-12": 4,  // B
            "1-13": 5,  // C
            "1-14": 6,  // N
            "1-15": 7,  // O
            "1-16": 8,  // F
            "1-17": 9,  // Ne
            "2-0": 10,  // Na
            "2-1": 11,  // Mg
            "2-12": 12, // Al
            "2-13": 13, // Si
            "2-14": 14, // P
            "2-15": 15, // S
            "2-16": 16, // Cl
            "2-17": 17, // Ar
            "3-0": 18,  // K
            "3-1": 19,  // Ca
            "3-2": 20,  // Sc
            "3-3": 21,  // Ti
            "3-4": 22,  // V
            "3-5": 23,  // Cr
            "3-6": 24,  // Mn
            "3-7": 25,  // Fe
            "3-8": 26,  // Co
            "3-9": 27,  // Ni
            "3-10": 28, // Cu
            "3-11": 29, // Zn
            "3-12": 30, // Ga
            "3-13": 31, // Ge
            "3-14": 32, // As
            "3-15": 33, // Se
            "3-16": 34, // Br
            "3-17": 35, // Kr
            "4-0": 36,  // Rb
            "4-1": 37,  // Sr
            "4-2": 38,  // Y
            "4-3": 39,  // Zr
            "4-4": 40,  // Nb
            "4-5": 41,  // Mo
            "4-6": 42,  // Tc
            "4-7": 43,  // Ru
            "4-8": 44,  // Rh
            "4-9": 45,  // Pd
            "4-10": 46, // Ag
            "4-11": 47, // Cd
            "4-12": 48, // In
            "4-13": 49, // Sn
            "4-14": 50, // Sb
            "4-15": 51, // Te
            "4-16": 52, // I
            "4-17": 53, // Xe
            "5-0": 54,  // Cs
            "5-1": 55,  // Ba
            "5-2": 56,  // La
            "5-3": 71,  // Hf
            "5-4": 72,  // Ta
            "5-5": 73,  // W
            "5-6": 74,  // Re
            "5-7": 75,  // Os
            "5-8": 76,  // Ir
            "5-9": 77,  // Pt
            "5-10": 78, // Au
            "5-11": 79, // Hg
            "5-12": 80, // Tl
            "5-13": 81, // Pb
            "5-14": 82, // Bi
            "5-15": 83, // Po
            "5-16": 84, // At
            "5-17": 85, // Rn
            "6-0": 86,  // Fr
            "6-1": 87,  // Ra
            "6-2": 88,  // Ac
            "6-3": 103, // Lr
            "6-4": 104, // Rf
            "6-5": 105, // Db
            "6-6": 106, // Sg
            "6-7": 107, // Bh
            "6-8": 108, // Hs
            "6-9": 109, // Mt
            "6-10": 110, // Ds
            "6-11": 111, // Rg
            "6-12": 112, // Cn
            "6-13": 113, // Nh
            "6-14": 114, // Fl
            "6-15": 115, // Mc
            "6-16": 116, // Lv
            "6-17": 117, // Ts
        };



        const key = `${row}-${col}`;
        const index = elementsMap[key];
        return index !== undefined ? elements[index] : null;
    }

    function rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function endGame() {
        gameEnded = true;
        const winner = players[0].points > players[1].points ? players[0] : players[1];
        updateGameInfo(`Game Over! ${winner.name} wins with ${winner.points} points!`);
        document.getElementById('roll-dice').style.display = 'none';
        document.getElementById('restart-game').classList.remove('hidden');
    }

    document.getElementById('restart-game').addEventListener('click', () => {
        players.forEach(player => {
            player.position = 0;
            player.points = 0;
        });
        currentPlayer = 0;
        gameEnded = false;
        document.getElementById('roll-dice').style.display = 'inline-block';
        document.getElementById('restart-game').classList.add('hidden');
        createGameBoard();
        updateGameInfo("Game restarted! Player 1's turn. Click 'Roll Dice' to play.");
        updatePlayerInfo();
    });

    document.getElementById('roll-dice').addEventListener('click', () => {
        if (gameEnded) return;

        const player = players[currentPlayer];
        const roll = rollDice();
        const oldPosition = player.position;
        const elem = movePlayerAndReturnElementName(player, roll);
        const element = elements.find(e => e.symbol === elem);
        const points = element.number;
        player.points += points;

        updateGameInfo(
            `${player.name} rolled a ${roll}.<br>
        Moved from ${elements[oldPosition].symbol} to ${element.symbol} (${element.name}).<br>
        Points gained: ${points}<br>
        Total points: ${player.points}`
        );

        updatePlayerInfo();
        endTurn();
    });

    createGameBoard();
    updateGameInfo("Game started! Player 1's turn. Click 'Roll Dice' to play.");
    updatePlayerInfo();
</script>
</body>
</html>
```

### Explanation:

1. Board Layout:
   - Represents a simplified periodic table with at least 90 elements
   - Each cell contains an element's symbol, atomic number, and color-coding

2. Player Mechanics:
   - Two-player turn-based system
   - Players move by rolling a virtual dice (1-6)
   - Player tokens visually represent position on the board

3. Scoring System:
   - Points awarded based on the atomic number of the landed element
   - Encourages learning of element properties and positions
   - Winner determined by the highest total score

4. Game Progression:
   - Players traverse the periodic table from left to right, top to bottom
   - Game continues until both players reach the final element
   - Allows for catch-up play if one player finishes first

5. User Interface:
   - Interactive periodic table as the main game board
   - Player information panels showing current scores and turn status
   - Game info section for real-time updates on moves and points
   - Roll dice button for player actions
   - Restart game option for replayability
   - End-game display showcases the winner and final scores

This game design effectively combines a periodic table with an engaging gameplay.
