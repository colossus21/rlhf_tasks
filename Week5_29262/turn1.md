### Code Plan:

1. UI:
    - Create a 4x3 grid of clickable cards.
    - Display turn indicator.
    - Show scoreboard.
    - Add feedback message area.
    - Create restart button.

2. Gameplay:
    - Initialize game state.
    - Handle card clicks.
    - Implement turn switching.
    - Track scores.
    - Check for win condition.
    - Implement restart functionality.

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pearl Guessing Game</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .card {
            width: 100px;
            height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            background-color: #3490dc;
            color: white;
            cursor: pointer;
            border: 2px solid #333;
            border-radius: 10px;
            transition: background-color 0.3s ease;
        }
        .card.revealed {
            background-color: #f6e05e;
            color: #333;
        }
        .pop {
            animation: pop 0.3s ease-in-out;
        }
        @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        .wobble {
            animation: wobble 0.6s ease-in-out;
        }
        @keyframes wobble {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
            75% { transform: rotate(-5deg); }
        }
        .turn-indicator {
            font-weight: bold;
            transition: color 0.5s ease;
        }
        .player1-turn {
            color: green;
        }
        .player2-turn {
            color: red;
        }
        .scoreboard {
            color: #2c3e50; /* Dark gray for elegant scores */
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center">
<div class="container mx-auto p-8 bg-white rounded-lg shadow-lg">
    <h1 class="text-4xl font-bold text-center mb-8">Pearl Guessing Game</h1>
    <div id="turnIndicator" class="text-2xl text-center mb-4 turn-indicator"></div>
    <div id="scoreBoard" class="text-xl text-center mb-4 scoreboard"></div>
    <div id="feedbackMessage" class="text-2xl font-bold text-center mb-4"></div>
    <div id="gameBoard" class="grid grid-cols-4 gap-4 mb-8 justify-items-center"></div>
    <div id="winMessage" class="text-3xl font-bold text-center mb-4"></div>
    <button id="restartButton" class="block mx-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Restart Game</button>
</div>

<script>
    const gameState = {
        cards: Array(12).fill(null),
        pearls: [],
        scores: [0, 0],
        currentPlayer: 0,
        gameOver: false
    };

    function initializeGame() {
        const winMessage = document.getElementById('winMessage');
        const feedbackMessage = document.getElementById('feedbackMessage');
        winMessage.textContent = ``;
        feedbackMessage.textContent = ``;
        gameState.cards = Array(12).fill(null);
        gameState.pearls = [];
        gameState.scores = [0, 0];
        gameState.currentPlayer = 0;
        gameState.gameOver = false;

        // Place pearls randomly
        while (gameState.pearls.length < 3) {
            const randomIndex = Math.floor(Math.random() * 12);
            if (!gameState.pearls.includes(randomIndex)) {
                gameState.pearls.push(randomIndex);
            }
        }

        updateUI();
    }

    function updateUI() {
        const turnIndicator = document.getElementById('turnIndicator');
        const currentPlayer = gameState.currentPlayer;

        // Update turn indicator with color
        turnIndicator.textContent = `Player ${currentPlayer + 1}'s Turn`;
        turnIndicator.className = `text-2xl text-center mb-4 turn-indicator player${currentPlayer + 1}-turn`;

        const scoreBoard = document.getElementById('scoreBoard');
        scoreBoard.innerHTML = `<span class="font-bold">Player 1: ${gameState.scores[0]}</span> | <span class="font-bold">Player 2: ${gameState.scores[1]}</span>`;

        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        for (let i = 0; i < 12; i++) {
            const card = document.createElement('div');
            card.className = `card ${gameState.cards[i] !== null ? 'revealed' : ''}`;
            card.innerHTML = `${gameState.cards[i] !== null ? (gameState.cards[i] ? '🔵' : '❌') : '?'}`;
            card.setAttribute('data-index', i);
            gameBoard.appendChild(card);
        }
    }

    function handleCardClick(index) {
        if (gameState.cards[index] !== null || gameState.gameOver) return;

        const card = document.querySelector(`.card[data-index="${index}"]`);
        const hasPearl = gameState.pearls.includes(index);
        gameState.cards[index] = hasPearl;

        const feedbackMessage = document.getElementById('feedbackMessage');
        card.classList.add('revealed');
        card.innerHTML = hasPearl ? '🔵' : '❌';
        card.classList.add('pop');

        if (hasPearl) {
            gameState.scores[gameState.currentPlayer]++;
            document.getElementById('gameBoard').classList.add('wobble');
            setTimeout(() => {
                document.getElementById('gameBoard').classList.remove('wobble');
            }, 600);

            feedbackMessage.textContent = `You have found a pearl! Take another turn!`;

            if (gameState.scores[gameState.currentPlayer] === 2) {
                gameState.gameOver = true;
                showWinMessage();
            } else {
                updateUI();
            }
        } else {
            feedbackMessage.textContent = ``;
            gameState.currentPlayer = 1 - gameState.currentPlayer;
            updateUI();
        }
    }

    function showWinMessage() {
        const winMessage = document.getElementById('winMessage');
        winMessage.textContent = `Player ${gameState.currentPlayer + 1} wins!`;
        winMessage.className = `text-3xl font-bold text-center mb-4 player${gameState.currentPlayer + 1}-turn`;
        document.getElementById('gameBoard').classList.add('pointer-events-none');
        updateUI();
    }

    document.getElementById('gameBoard').addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card && !card.classList.contains('revealed')) {
            const index = parseInt(card.getAttribute('data-index'));
            handleCardClick(index);
        }
    });

    document.getElementById('restartButton').addEventListener('click', () => {
        document.getElementById('gameBoard').classList.remove('pointer-events-none');
        initializeGame();
    });

    initializeGame();
</script>
</body>
</html>
```

The code implements the "Pearl Guessing Game" using JavaScript and uses TailwindCSS for styling. 
The game is structured using a container div that includes the game title, turn indicator, scoreboard, feedback message, game board, win message, and restart button.
The `initializeGame()` function sets up the initial game state, randomly places pearls, and updates the UI.
The `updateUI()` function refreshes the game board, turn indicator, and scoreboard based on the current game state.
The `handleCardClick()` function handles card revealing, updating score and checking for a win.
The game ends when a player collects 2 pearls.

This implementation creates an interactive and visually appealing Pearl Guessing Game.