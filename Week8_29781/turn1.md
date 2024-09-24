### Code Plan:
1. HTML structure with game board, player info, and modal
2. CSS styling for game layout and visual appeal
3. JavaScript for game logic:
    - Country data array with flags, names, and events
    - Player object creation
    - Game board creation and randomization
    - Dice rolling mechanism
    - Player movement and position updating
    - Turn management and game state updates
    - Modal display for events
    - Game end condition and winner declaration

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Global Explorer Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }
        #game-container {
            text-align: center;
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        #game-board {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 5px;
            margin-bottom: 20px;
        }
        .space {
            background-color: #e7e7e7;
            border: 1px solid #ddd;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            height: 60px;
            overflow: hidden;
        }
        .space img {
            width: 16px;
            height: auto;
            display: block;
        }
        .player-token {
            position: absolute;
            font-size: 24px;
        }
        .player1-token {
            top: 5px;
            left: 5px;
        }
        .player2-token {
            bottom: 5px;
            right: 5px;
        }
        button {
            font-size: 16px;
            padding: 10px 20px;
            margin: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        #game-info {
            margin-top: 20px;
            font-size: 18px;
            background-color: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
        }
        .player-info {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
        }
        .player-card {
            background-color: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
            width: 45%;
        }
        .current-player {
            border: 2px solid #4CAF50;
        }
        #modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
        }
        #modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 500px;
            text-align: center;
            border-radius: 10px;
        }
    </style>
</head>
<body>
<div id="game-container">
    <h1>Global Explorer Game</h1>
    <div class="player-info">
        <div id="player1-info" class="player-card">
            <h3>Player 1 🚶‍♂️</h3>
            <p>Points: <span id="player1-points">0</span></p>
        </div>
        <div id="player2-info" class="player-card">
            <h3>Player 2 🚶‍♀️</h3>
            <p>Points: <span id="player2-points">0</span></p>
        </div>
    </div>
    <div id="game-board"></div>
    <button id="roll-dice">Roll Dice</button>
    <div id="game-info"></div>
</div>

<div id="modal">
    <div id="modal-content">
        <p id="modal-text"></p>
    </div>
</div>

<script>
    const countryData = [
        { code: 'US', name: 'USA', message: "🗽 Visited the Statue of Liberty in New York, you earn 25 points!" },
        { code: 'JP', name: 'Japan', message: "🌸 Experienced cherry blossom season in Kyoto, you earn 30 points!" },
        { code: 'FR', name: 'France', message: "🗼 Climbed to the top of the Eiffel Tower, you earn 20 points!" },
        { code: 'BR', name: 'Brazil', message: "🎉 Danced at the Rio Carnival, you earn 35 points!" },
        { code: 'AU', name: 'Australia', message: "🐠 Snorkeled at the Great Barrier Reef, you earn 40 points!" },
        { code: 'IN', name: 'India', message: "🏰 Visited the Taj Mahal at sunrise, you earn 30 points!" },
        { code: 'CA', name: 'Canada', message: "🌌 Saw the Northern Lights in Yukon, you earn 45 points!" },
        { code: 'IT', name: 'Italy', message: "🚣 Rode a gondola in Venice, you earn 25 points!" },
        { code: 'GB', name: 'UK', message: "👑 Watched the changing of the guard at Buckingham Palace, you earn 20 points!" },
        { code: 'CN', name: 'China', message: "🏯 Walked the Great Wall, you earn 35 points!" },
        { code: 'EG', name: 'Egypt', message: "🏜️ Explored the Pyramids of Giza, you earn 40 points!" },
        { code: 'MX', name: 'Mexico', message: "🏛️ Visited the ancient Mayan ruins of Chichen Itza, you earn 30 points!" },
        { code: 'TH', name: 'Thailand', message: "💦 Attended the Songkran water festival, you earn 25 points!" },
        { code: 'ZA', name: 'South Africa', message: "🦁 Went on a safari in Kruger National Park, you earn 45 points!" },
        { code: 'AR', name: 'Argentina', message: "💃 Danced tango in Buenos Aires, you earn 30 points!" },
        { code: 'GR', name: 'Greece', message: "🏛️ Explored the Acropolis in Athens, you earn 35 points!" },
        { code: 'NZ', name: 'New Zealand', message: "🤸 Bungee jumped in Queenstown, you earn 40 points!" },
        { code: 'IS', name: 'Iceland', message: "💧 Relaxed in the Blue Lagoon geothermal spa, you earn 30 points!" },
        { code: 'PE', name: 'Peru', message: "⛰️ Hiked to Machu Picchu, you earn 45 points!" },
        { code: 'NL', name: 'Netherlands', message: "🌷 Cycled through the tulip fields, you earn 25 points!" },
        { code: 'TR', name: 'Turkey', message: "🎈 Took a hot air balloon ride over Cappadocia, you earn 40 points!" },
        { code: 'VN', name: 'Vietnam', message: "⛵ Cruised through Ha Long Bay, you earn 35 points!" },
        { code: 'SE', name: 'Sweden', message: "❄️ Stayed in the Ice Hotel in Jukkasjärvi, you earn 40 points!" },
        { code: 'MA', name: 'Morocco', message: "🔵 Explored the blue city of Chefchaouen, you earn 30 points!" },
        { code: 'CH', name: 'Switzerland', message: "⛷️ Skied in the Swiss Alps, you earn 35 points!" },
        { code: 'SG', name: 'Singapore', message: "🌳 Marveled at the Supertrees in Gardens by the Bay, you earn 25 points!" },
        { code: 'PT', name: 'Portugal', message: "🏄 Surfed the waves in Nazaré, you earn 30 points!" },
        { code: 'CR', name: 'Costa Rica', message: "🌿 Ziplined through the cloud forests of Monteverde, you earn 35 points!" },
        { code: 'AE', name: 'UAE', message: "🏙️ Went to the top of Burj Khalifa in Dubai, you earn 30 points!" },
        { code: 'CL', name: 'Chile', message: "✨ Stargazed in the Atacama Desert, you earn 40 points!" },
        { code: 'BD', name: 'Bangladesh', message: "🏖️ Visited the Cox's Bazar beach, you earn 30 points!" },
        { code: 'PH', name: 'Philippines', message: "🐋 Swam with whale sharks in Oslob, you earn 45 points!" },
        { code: 'NO', name: 'Norway', message: "🛳️ Cruised through the fjords, you earn 35 points!" },
        { code: 'JM', name: 'Jamaica', message: "🌊 Climbed Dunn's River Falls, you earn 30 points!" },
        { code: 'HU', name: 'Hungary', message: "♨️ Relaxed in the thermal baths of Budapest, you earn 25 points!" },
        { code: 'KE', name: 'Kenya', message: "🐾 Witnessed the Great Migration in Masai Mara, you earn 45 points!" }
    ];

    const players = [
        { name: "Player 1", position: -1, points: 0, token: '🚶‍♂️' },
        { name: "Player 2", position: -1, points: 0, token: '🚶‍♀️' }
    ];

    let currentPlayer = 0;
    let gameEnded = false;
    let board = [];

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function createGameBoard() {
        const gameBoard = document.getElementById('game-board');
        board = shuffleArray(countryData).slice(0, 36);

        board.forEach((country, index) => {
            const space = document.createElement('div');
            space.className = 'space';

            const flagImg = document.createElement('img');
            flagImg.src = `https://flagsapi.com/${country.code}/flat/16.png`;
            flagImg.alt = country.name;

            space.appendChild(flagImg);
            gameBoard.appendChild(space);
        });
    }

    function rollDice() {
        const roll = Math.floor(Math.random() * 6) + 1;
        const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        updateGameInfo(`${players[currentPlayer].name} rolled a ${diceFaces[roll - 1]} (${roll}).`);
        return roll;
    }

    function movePlayer(player, spaces) {
        const oldPosition = player.position;
        player.position = Math.min(player.position + spaces, 35);
        updatePlayerPosition(player, oldPosition);
        return player.position;
    }

    function updatePlayerPosition(player, oldPosition) {
        const spaces = document.querySelectorAll('.space');

        if (oldPosition >= 0) {
            const oldSpace = spaces[oldPosition];
            const tokens = oldSpace.querySelectorAll('.player-token');
            tokens.forEach(token => token.remove());
        }

        const currentSpace = spaces[player.position];

        const playerToken = document.createElement('div');
        playerToken.className = `player-token player${currentPlayer + 1}-token`;
        playerToken.textContent = player.token;

        currentSpace.appendChild(playerToken);
    }

    function updateGameInfo(message) {
        document.getElementById('game-info').innerHTML = message;
    }

    function updatePlayerInfo() {
        document.getElementById('player1-points').textContent = players[0].points;
        document.getElementById('player2-points').textContent = players[1].points;
        document.getElementById('player1-info').classList.toggle('current-player', currentPlayer === 0);
        document.getElementById('player2-info').classList.toggle('current-player', currentPlayer === 1);
    }

    function showModal(message) {
        const modal = document.getElementById('modal');
        const modalText = document.getElementById('modal-text');
        modalText.textContent = message;
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 1500);
    }

    function endTurn() {
        if (players.every(p => p.position >= 35)) {
            endGame();
        } else {
            currentPlayer = (currentPlayer + 1) % 2;
            updatePlayerInfo();
        }
    }

    function endGame() {
        gameEnded = true;
        const [player1, player2] = players;
        let winner = null;
        if (player1.points > player2.points) {
            winner = player1;
        } else if (player2.points > player1.points) {
            winner = player2;
        }

        if (winner) {
            updateGameInfo(`🏆 Game Over! ${winner.name} wins with ${winner.points} points!`);
        } else {
            updateGameInfo(`🤝 Game Over! It's a tie with ${player1.points} points each!`);
        }
        document.getElementById('roll-dice').disabled = true;
    }

    document.getElementById('roll-dice').addEventListener('click', () => {
        if (gameEnded) return;

        const player = players[currentPlayer];
        const roll = rollDice();
        const newPosition = movePlayer(player, roll);

        if (newPosition >= board.length) {
            showModal("🎉 You've reached the end of the journey!");
            endTurn();
            return;
        }

        const country = board[newPosition];
        const points = parseInt(country.message.match(/\d+/)[0]);
        player.points += points;

        showModal(`${country.name}: ${country.message}`);

        updateGameInfo(
                `${player.name} landed on ${country.name}.<br>
                ${country.message}<br>
                Total points: ${player.points}`
        );

        updatePlayerInfo();
        endTurn();
    });

    createGameBoard();
    updateGameInfo("Game started! Player 1's turn.");
    updatePlayerInfo();
</script>
</body>
</html>
```

### Explanation:

1. 6x6 grid board: The code creates a 6x6 grid (36 spaces) using CSS grid layout. Each cell contains a unique country with its flag and an associated event with points.
2. Real country flags: The code uses the exact URL format provided (https://flagsapi.com/${country.code}/flat/16.png) to display country flags.
3. 2 players with alternating turns: The game implements two players (🚶‍♂️ and 🚶‍♀️) who take turns rolling the dice using the 'Roll Dice' button.
4. Points and messages: When a player lands on a cell, they receive points and a message about a famous landmark or activity in that country, as defined in the countryData array.
5. Emoji player tokens: The code uses the exact emojis requested (🚶‍♂️ and 🚶‍♀️) to represent the players on the board.
6. Modal pop-up and messages: A modal pop-up is displayed for 1.5 seconds when a player lands on a country, showing the event and points earned. The current player's turn and each player's total points are displayed in the player info section. The message is also shown below the board in the game info section.
7. Game end condition: The game ends when both players reach the end of the board (`position >= 35`). The winner is declared based on who has the most points at the end.

The approach implements an engaging 'Global Explorer' board game.