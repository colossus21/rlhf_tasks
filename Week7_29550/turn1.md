### Code Plan:

1. UI:
   - Use flexbox for centering and layout
   - Style cards with emojis, borders, and hover effects
   - Highlight scores with distinct background colors
   - Add animations for card selection and score changes

2. Gameplay:
   - Set up initial game state
   - Handle card selection
   - Reveal AI's card
   - Determine if points are scored
   - Update and display new scores
   - Check if a player has won
   - Begin a new round
   - Handle game end and show alert

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Battle of Foods</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
            color: #333;
        }
        .game-container {
            background-color: #fff;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 0 30px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            width: 100%;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .player-cards {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
        }
        .card {
            font-size: 3em;
            cursor: pointer;
            padding: 20px;
            border: 3px solid #3498db;
            border-radius: 15px;
            transition: all 0.3s ease;
            margin: 0 15px;
            background-color: #ecf0f1;
            box-shadow: 0 6px 10px rgba(0,0,0,0.1);
        }
        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 15px rgba(0,0,0,0.2);
        }
        .center-card {
            font-size: 5em;
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            border: 4px solid #e74c3c;
            border-radius: 20px;
            background-color: #f9e9e8;
            transition: all 0.5s ease;
        }
        .score-container {
            display: flex;
            justify-content: space-around;
            margin-top: 30px;
            font-size: 1.5em;
        }
        .score {
            background-color: #3498db;
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            transition: all 0.3s ease;
        }
        .round {
            font-size: 1.2em;
            margin-top: 20px;
        }
        .feedback, .direction {
            font-size: 1.5em;
            font-weight: bold;
            height: 30px;
            margin-top: 20px;
        }
        .feedback {
            color: #27ae60;
        }
        .direction {
            color: #e67e22;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        .pulse {
            animation: pulse 0.5s;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .fade-in {
            animation: fadeIn 1s;
        }
        @keyframes scoreChange {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); background-color: #e74c3c; }
            100% { transform: scale(1); }
        }
        .score-change {
            animation: scoreChange 0.5s;
        }
    </style>
</head>
<body>
<div class="game-container">
    <h1>Battle of Foods</h1>
    <div class="round">Round <span id="roundNumber">1</span></div>
    <div class="player-cards" id="player1">
        <div class="card" onclick="selectCard(1, 0)">🐟</div>
        <div class="card" onclick="selectCard(1, 1)">🍌</div>
        <div class="card" onclick="selectCard(1, 2)">🎋</div>
        <div class="card" onclick="selectCard(1, 3)">🥕</div>
    </div>
    <div class="center-card" id="centerCard">❓</div>
    <div class="player-cards" id="player2">
        <div class="card" onclick="selectCard(2, 0)">🐟</div>
        <div class="card" onclick="selectCard(2, 1)">🍌</div>
        <div class="card" onclick="selectCard(2, 2)">🎋</div>
        <div class="card" onclick="selectCard(2, 3)">🥕</div>
    </div>
    <div class="score-container">
        <div class="score" id="score1">Player 1: 0</div>
        <div class="score" id="score2">Player 2: 0</div>
    </div>
    <div class="direction" id="direction"></div>
    <div class="feedback" id="feedback"></div>
</div>

<script>
    const centerCards = ['🐧', '🐒', '🐼', '🐰'];
    const playerCards = ['🐟', '🍌', '🎋', '🥕'];
    let currentPlayer = 1;
    let scores = [0, 0];
    let selectedCards = [null, null];
    let currentRound = 1;

    function selectCard(player, index) {
        if (player !== currentPlayer) return;

        selectedCards[player - 1] = index;
        document.querySelectorAll(`#player${player} .card`).forEach(card => card.classList.remove('pulse'));
        const selectedCard = document.querySelector(`#player${player} .card:nth-child(${index + 1})`);
        selectedCard.classList.add('pulse');

        showFeedback(`Player ${player} selected ${playerCards[index]}`);

        if (currentPlayer === 1) {
            currentPlayer = 2;
            showDirection("Player 2, pick a card!");
        } else {
            showDirection("Revealing center card...");
            setTimeout(revealCenterCard, 1000);
        }
    }

    function revealCenterCard() {
        const centerIndex = Math.floor(Math.random() * centerCards.length);
        const centerCard = centerCards[centerIndex];
        const centerCardElement = document.getElementById('centerCard');
        centerCardElement.textContent = centerCard;
        centerCardElement.classList.add('pulse');

        setTimeout(() => {
            checkScore(1, centerIndex);
            checkScore(2, centerIndex);
            updateScores();
            checkWinCondition();
        }, 1000);
    }

    function checkScore(player, centerIndex) {
        if (selectedCards[player - 1] === centerIndex) {
            scores[player - 1]++;
            showFeedback(`Player ${player} scores a point!`);
        }
    }

    function updateScores() {
        for (let i = 1; i <= 2; i++) {
            const scoreElement = document.getElementById(`score${i}`);
            scoreElement.textContent = `Player ${i}: ${scores[i-1]}`;
            scoreElement.classList.add('score-change');
            setTimeout(() => scoreElement.classList.remove('score-change'), 500);
        }
    }

    function checkWinCondition() {
        if (scores[0] >= 5 || scores[1] >= 5) {
            const winner = scores[0] >= 5 ? 1 : 2;
            showFeedback(`Player ${winner} wins the game!`);
            showDirection("Game Over!");
            setTimeout(() => {
                if (confirm(`Player ${winner} wins! Do you want to play again?`)) {
                    resetGame();
                }
            }, 1000);
        } else {
            setTimeout(startNewRound, 1000);
        }
    }

    function startNewRound() {
        currentRound++;
        document.getElementById('roundNumber').textContent = currentRound;
        showFeedback(`Starting Round ${currentRound}`);
        resetRound();
    }

    function resetRound() {
        currentPlayer = 1;
        selectedCards = [null, null];
        document.querySelectorAll('.card').forEach(card => card.classList.remove('pulse'));
        document.getElementById('centerCard').textContent = '❓';
        document.getElementById('centerCard').classList.remove('pulse');
        showDirection("Player 1, pick a card!");
    }

    function resetGame() {
        scores = [0, 0];
        currentRound = 1;
        updateScores();
        document.getElementById('roundNumber').textContent = currentRound;
        resetRound();
        showFeedback('New game started!');
        showDirection("Player 1, pick a card!");
    }

    function showFeedback(message) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.classList.remove('fade-in');
        void feedback.offsetWidth; // Trigger reflow
        feedback.classList.add('fade-in');
    }

    function showDirection(message) {
        const direction = document.getElementById('direction');
        direction.textContent = message;
        direction.classList.remove('fade-in');
        void direction.offsetWidth; // Trigger reflow
        direction.classList.add('fade-in');
    }

    // Initialize the game
    showDirection("Player 1, pick a card!");
</script>
</body>
</html>
```

### Explanation:

1. UI Design:
   - Centered layout with clear separation between elements
   - Player cards at top and bottom, center card in the middle
   - Round number displayed prominently at the top
   - Scores highlighted at the bottom
   - Use emojis for card symbols (🐟, 🍌, 🎋, 🥕, 🐧, 🐒, 🐼, 🐰)
   - Visually appealing with consistent styling and animations

2. Gameplay Flow:
   - Game initializes with round 1
   - Player 1 selects a card
   - Player 2 selects a card
   - Center card reveals AI's choice
   - Scores are updated if there's a match
   - Check for win condition (5 points)
   - If no winner, start new round
   - If winner, end the game and show alert

3. Animations and Interactivity:
   - Hover effects on cards for better user feedback
   - Animations for card selection and score changes
   - Clear status messages for game progress
   - Alert after the game ends

This plan provides a structured approach to implementing the game "Battle of Foods".