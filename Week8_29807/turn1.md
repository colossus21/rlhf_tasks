### Code Plan:

1. UI
    1. Create main game container
    2. Design player info displays (name, score, active status)
    3. Implement countdown timer display
    4. Develop letter grid with clickable cells
    5. Add word display area for current selection
    6. Create confirm and clear buttons
    7. Design message display area
    8. Implement game over modal with play again button
    9. Style with space theme (starry background, neon borders)

2. Game Mechanics
    1. Initialize game state (letter grid, player scores, current player)
    2. Implement turn management system
    3. Create 15-second countdown timer logic
    4. Develop letter selection and word formation mechanics
    5. Integrate API call for word validation
    6. Implement scoring system (3 points per letter)
    7. Handle player timeout and elimination
    8. Manage game end conditions (empty grid or both players out)
    9. Determine winner and display results
    10. Implement game restart functionality

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Word Matchers</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #00ffff;
            --secondary-color: #ff00ff;
            --player1-color: #00ff00;
            --player2-color: #ff8c00;
            --background-color: #000033;
            --text-color: #ffffff;
            --cell-bg-color: rgba(255, 255, 255, 0.1);
            --cell-border-color: #00ffff;
            --timed-out-color: #4a4a4a;
        }
        body {
            font-family: 'Roboto', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: var(--background-color);
            background-image:
                    radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
                    radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
                    radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),
                    radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px);
            background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
            background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
            animation: backgroundScroll 60s linear infinite;
            color: var(--text-color);
        }
        @keyframes backgroundScroll {
            0% { background-position: 0 0, 40px 60px, 130px 270px, 70px 100px; }
            100% { background-position: 550px 550px, 590px 610px, 680px 820px, 620px 650px; }
        }
        #game-container {
            text-align: center;
            background-color: rgba(0, 0, 51, 0.8);
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            max-width: 800px;
            width: 100%;
            position: relative;
            backdrop-filter: blur(5px);
        }
        h1 {
            font-family: 'Orbitron', sans-serif;
            color: var(--primary-color);
            margin-bottom: 1.5rem;
            font-weight: 700;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        #letter-pool {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin: 1.5rem auto;
            max-width: 600px;
        }
        .letter {
            width: 40px;
            height: 40px;
            border: 2px solid var(--cell-border-color);
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            background-color: var(--cell-bg-color);
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        }
        .letter:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
        }
        .letter.used {
            opacity: 0.3;
            cursor: not-allowed;
        }
        #word-display {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.8rem;
            margin: 1.5rem 0;
            min-height: 2.5rem;
            color: var(--primary-color);
            font-weight: 700;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        .player-info {
            display: flex;
            justify-content: space-around;
            margin-bottom: 1rem;
        }
        .player {
            padding: 1rem;
            border-radius: 10px;
            background-color: rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        #player1 {
            color: var(--player1-color);
        }
        #player2 {
            color: var(--player2-color);
        }
        .active-player {
            box-shadow: 0 0 15px currentColor;
        }
        .timed-out {
            color: var(--timed-out-color) !important;
            box-shadow: 0 0 15px var(--timed-out-color);
            opacity: 0.7;
        }
        #timer {
            font-size: 2rem;
            font-weight: bold;
            margin: 1rem 0;
            color: var(--secondary-color);
        }
        button {
            font-family: 'Orbitron', sans-serif;
            margin: 0.5rem;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            cursor: pointer;
            background-color: rgba(0, 255, 255, 0.2);
            color: var(--primary-color);
            border: 2px solid var(--primary-color);
            border-radius: 8px;
            transition: all 0.3s ease;
            font-weight: 700;
        }
        button:hover {
            background-color: rgba(0, 255, 255, 0.4);
            transform: translateY(-2px);
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
        }
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        #message {
            font-size: 1.1rem;
            margin: 1rem 0;
            min-height: 1.5rem;
            color: #00ff00;
        }
        #game-over {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 51, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        #game-over-content {
            background-color: rgba(0, 0, 51, 0.8);
            padding: 3rem;
            border-radius: 20px;
            text-align: center;
            min-width: 300px;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
        }
    </style>
</head>
<body>
<div id="game-container">
    <h1>Word Matchers</h1>
    <div class="player-info">
        <div id="player1" class="player">
            <h2>Player 1</h2>
            <p>Score: <span id="score1">0</span></p>
        </div>
        <div id="player2" class="player">
            <h2>Player 2</h2>
            <p>Score: <span id="score2">0</span></p>
        </div>
    </div>
    <div id="timer">15</div>
    <div id="letter-pool"></div>
    <div id="word-display"></div>
    <button id="confirm-button">Confirm Word</button>
    <button id="clear-button">Clear Selection</button>
    <div id="message"></div>
</div>

<script>
    const GAME_TIME = 15;
    const LETTERS = 'AAABCDEEEEFGHIIIJKLMNOOOPQRSTUUVWXYZ';
    let letterPool = [];
    let selectedLetters = [];
    let player1Score = 0;
    let player2Score = 0;
    let currentPlayer = 1;
    let timer;
    let timerInterval;
    let gameOver = false;
    let player1TimedOut = false;
    let player2TimedOut = false;

    function initGame() {
        letterPool = Array.from({length: 50}, () => LETTERS[Math.floor(Math.random() * LETTERS.length)]);
        renderLetterPool();
        updatePlayerInfo();
        startPlayerTurn();
    }

    function renderLetterPool() {
        const poolElement = document.getElementById('letter-pool');
        poolElement.innerHTML = '';
        letterPool.forEach((letter, index) => {
            const letterElement = document.createElement('div');
            letterElement.className = 'letter';
            letterElement.textContent = letter;
            letterElement.dataset.index = index;
            letterElement.addEventListener('click', () => selectLetter(index));
            poolElement.appendChild(letterElement);
        });
    }

    function selectLetter(index) {
        if (gameOver || (currentPlayer === 1 && player1TimedOut) || (currentPlayer === 2 && player2TimedOut)) return;
        const letterElement = document.querySelector(`.letter[data-index="${index}"]`);
        if (letterElement.classList.contains('used')) return;

        selectedLetters.push({index, letter: letterPool[index]});
        letterElement.classList.add('used');
        updateWordDisplay();
    }

    function updateWordDisplay() {
        const wordDisplay = document.getElementById('word-display');
        wordDisplay.textContent = selectedLetters.map(l => l.letter).join('');
    }

    function clearSelection() {
        selectedLetters.forEach(({index}) => {
            const letterElement = document.querySelector(`.letter[data-index="${index}"]`);
            letterElement.classList.remove('used');
        });
        selectedLetters = [];
        updateWordDisplay();
    }

    async function confirmWord() {
        if (gameOver || (currentPlayer === 1 && player1TimedOut) || (currentPlayer === 2 && player2TimedOut)) return;
        const word = selectedLetters.map(l => l.letter).join('').toLowerCase();
        const messageElement = document.getElementById('message');

        if (word.length < 2) {
            messageElement.textContent = 'Word must be at least 2 letters long.';
            return;
        }

        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                const score = word.length * 3;
                if (currentPlayer === 1) {
                    player1Score += score;
                } else {
                    player2Score += score;
                }
                updatePlayerInfo();
                messageElement.textContent = `Valid word! +${score} points.`;
                selectedLetters.forEach(({index}) => {
                    letterPool[index] = '';
                });
                renderLetterPool();
                clearSelection();
                endPlayerTurn();
            } else {
                messageElement.textContent = 'Not a valid word. Try again.';
            }
        } catch (error) {
            messageElement.textContent = 'Error occurred. Please try again.';
        }
    }

    function startPlayerTurn() {
        updatePlayerInfo();
        timer = GAME_TIME;
        updateTimer();
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timer--;
            updateTimer();
            if (timer === 0) {
                clearInterval(timerInterval);
                playerTimedOut();
            }
        }, 1000);
    }

    function playerTimedOut() {
        if (currentPlayer === 1) {
            player1TimedOut = true;
            document.getElementById('player1').classList.add('timed-out');
        } else {
            player2TimedOut = true;
            document.getElementById('player2').classList.add('timed-out');
        }

        if (player1TimedOut && player2TimedOut) {
            endGame();
        } else if (player1TimedOut && player1Score < player2Score) {
            endGame();
        } else if (player2TimedOut && player2Score < player1Score) {
            endGame();
        } else {
            endPlayerTurn();
        }
    }

    function endPlayerTurn() {
        clearSelection();
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        if (letterPool.every(letter => letter === '') || (player1TimedOut && player2TimedOut)) {
            endGame();
        } else if ((currentPlayer === 1 && player1TimedOut) || (currentPlayer === 2 && player2TimedOut)) {
            endPlayerTurn(); // Skip the timed-out player
        } else {
            startPlayerTurn();
        }
    }

    function updateTimer() {
        document.getElementById('timer').textContent = timer;
    }

    function updatePlayerInfo() {
        document.getElementById('score1').textContent = player1Score;
        document.getElementById('score2').textContent = player2Score;
        document.getElementById('player1').classList.toggle('active-player', currentPlayer === 1 && !player1TimedOut);
        document.getElementById('player2').classList.toggle('active-player', currentPlayer === 2 && !player2TimedOut);
    }

    function endGame() {
        gameOver = true;
        clearInterval(timerInterval);
        let winner;
        if (player1Score > player2Score) {
            winner = 'Player 1';
        } else if (player2Score > player1Score) {
            winner = 'Player 2';
        } else {
            winner = "No one";
        }
        const gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'game-over';
        gameOverScreen.innerHTML = `
        <div id="game-over-content">
            <h2>Game Over!</h2>
            <p>${winner} wins!</p>
            <p>Player 1 score: ${player1Score}</p>
            <p>Player 2 score: ${player2Score}</p>
            <button id="restart-button">Play Again</button>
        </div>
    `;
        document.body.appendChild(gameOverScreen);
        document.getElementById('restart-button').addEventListener('click', restartGame);
    }

    function restartGame() {
        document.body.removeChild(document.getElementById('game-over'));
        gameOver = false;
        player1Score = 0;
        player2Score = 0;
        currentPlayer = 1;
        player1TimedOut = false;
        player2TimedOut = false;
        document.getElementById('player1').classList.remove('timed-out');
        document.getElementById('player2').classList.remove('timed-out');
        clearInterval(timerInterval);
        initGame();
    }

    function updateButtonStates() {
        const confirmButton = document.getElementById('confirm-button');
        const clearButton = document.getElementById('clear-button');
        const isCurrentPlayerTimedOut = (currentPlayer === 1 && player1TimedOut) || (currentPlayer === 2 && player2TimedOut);

        confirmButton.disabled = gameOver || isCurrentPlayerTimedOut;
        clearButton.disabled = gameOver || isCurrentPlayerTimedOut;
    }

    document.getElementById('confirm-button').addEventListener('click', confirmWord);
    document.getElementById('clear-button').addEventListener('click', clearSelection);

    initGame();
</script>
</body>
</html>
```

### Explanation:

1. UI
    - Center-aligned game container houses all elements
    - Player info at top shows scores and active player
    - Prominent timer display creates urgency
    - Interactive letter grid forms game's core
    - Word display area shows current selection
    - Confirm/Clear buttons for word submission/reset
    - Message area provides feedback
    - Modal overlay for game end and restart option
    - Space theme with animated background and neon accents

2. Game Mechanics
    - Game initializes with random letter grid and player setup
    - Turn system alternates players, managing active states
    - 15-second timer limits each turn
    - Letter selection builds words in display area
    - API validates words, updating score on success
    - Timeout eliminates player from further turns
    - Game ends on empty grid or both players timing out
    - Highest score determines winner
    - Play again option resets game state

This structure creates an engaging two-player word game with a space theme.