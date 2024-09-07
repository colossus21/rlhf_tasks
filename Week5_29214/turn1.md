### Code Plan:

1. UI:
   - The game board contains 4 players—human player at the bottom, 3 AI represented as Sleuth 1, Sleuth 2, Sleuth 3 positioned at the other three corners.
   - The card deck with 4 unrevealed cards stays at the center.
   - There should be a turn indicator section at the top. It displays the current turn number and the target for the detective to find.
   - Each player should have the role and score displayed; the role could be hidden till all the cards are revealed.
   - Actions and feedback are displayed at the bottom of the game

2. Gameplay:
   - The game begins with cards being shuffled and each player picking a card.
   - If a player picks a detective card, the detective is revealed immediately. Other roles remain hidden.
   - The detective finds the target criminal based on the sequence - Thief, Mob, Serial Killer.
   - If the detective guesses correctly, every player except the guessed criminal will get the points. If the detective's guess is wrong, everyone except the detective gets the points.
   - If a player's score reaches 4000 points, that player wins the game.

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mystery Detective Game</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            display: grid;
            grid-template-rows: auto 1fr auto;
            height: 100vh;
            background-color: #0f172a;
            color: #f1f5f9;
            font-family: 'Arial', sans-serif;
        }

        #turn-indicator {
            grid-row: 1 / 2;
            text-align: center;
            font-size: 1.75rem;
            padding: 20px;
            background-color: #1e293b;
            border-bottom: 2px solid #334155;
        }

        #target-indicator {
            font-size: 1.25rem;
            color: #fbbf24;
            margin-top: 10px;
            font-weight: bold;
        }

        #game-board {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            grid-template-rows: 1fr auto 1fr;
            gap: 20px;
            justify-items: center;
            align-items: center;
            padding: 20px;
        }

        .player {
            padding: 20px;
            border-radius: 15px;
            background-color: #1e293b;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .player:hover {
            transform: translateY(-5px);
        }

        .player-name {
            margin-bottom: 10px;
            font-size: 1.2rem;
            color: #60a5fa;
            font-weight: bold;
        }

        .player-score {
            margin-top: 10px;
            font-size: 1.25rem;
            color: #34d399;
        }

        .player-role {
            margin-top: 10px;
            font-size: 1rem;
            color: #f472b6;
        }

        #player-left { grid-column: 1 / 2; grid-row: 2 / 3; }
        #player-top { grid-column: 2 / 3; grid-row: 1 / 2; }
        #player-right { grid-column: 3 / 4; grid-row: 2 / 3; }
        #player-bottom { grid-column: 2 / 3; grid-row: 3 / 4; }

        #card-center {
            grid-column: 2 / 3;
            grid-row: 2 / 3;
            display: flex;
            justify-content: center;
            gap: 20px;
        }

        .card {
            background-color: #334155;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            cursor: pointer;
            transition: transform 0.3s ease, background-color 0.3s ease;
            font-size: 1.2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            color: #f1f5f9;
        }

        .card:hover {
            transform: scale(1.1);
            background-color: #475569;
        }

        .picked { background-color: #4338ca; }
        .revealed { background-color: #f59e0b; color: #0f172a; }

        #message-display {
            grid-row: 3 / 4;
            text-align: center;
            font-size: 1.25rem;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
        }

        #feedback {
            font-size: 1.2rem;
            font-weight: bold;
            color: #fbbf24;
            min-height: 2em;
        }

        #nextTurn {
            display: none;
            background-color: #3b82f6;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 1.2rem;
            transition: background-color 0.3s ease;
        }

        #nextTurn:hover {
            background-color: #2563eb;
        }
    </style>
</head>
<body>

<div id="turn-indicator">
    Mystery Detective Game
    <div>Turn <span id="turnNumber">1</span></div>
    <div id="target-indicator"></div>
</div>

<div id="game-board">
    <div id="player-left" class="player">
        <div class="player-name">Sleuth 1</div>
        <div id="roleLeft" class="player-role"></div>
        <div id="scoreLeft" class="player-score">0 points</div>
    </div>
    <div id="player-top" class="player">
        <div class="player-name">Sleuth 2</div>
        <div id="roleTop" class="player-role"></div>
        <div id="scoreTop" class="player-score">0 points</div>
    </div>
    <div id="player-right" class="player">
        <div class="player-name">Sleuth 3</div>
        <div id="roleRight" class="player-role"></div>
        <div id="scoreRight" class="player-score">0 points</div>
    </div>
    <div id="card-center">
        <div id="card1" class="card">?</div>
        <div id="card2" class="card">?</div>
        <div id="card3" class="card">?</div>
        <div id="card4" class="card">?</div>
    </div>
    <div id="player-bottom" class="player">
        <div class="player-name">You</div>
        <div id="roleBottom" class="player-role"></div>
        <div id="scoreBottom" class="player-score">0 points</div>
    </div>
</div>

<div id="message-display">
    <div id="feedback"></div>
    <button id="nextTurn">Next Turn</button>
</div>

<script>
    // Game states
    let turnNumber = 1;
    let scores = { playerLeft: 0, playerTop: 0, playerRight: 0, playerBottom: 0 };
    let currentTarget = "Thief";
    let detective = "";

    const cards = [
        { name: "Detective", points: 1000, elementId: "card1" },
        { name: "Thief", points: 600, elementId: "card2" },
        { name: "Mob", points: 800, elementId: "card3" },
        { name: "Serial Killer", points: 1000, elementId: "card4" },
    ];

    // Shuffles the deck
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function addCardEventListeners() {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', playerPickCard);
        });
    }

    // Handles player cards
    function playerPickCard(event) {
        const cardId = event.target.id;
        const card = cards.find(c => c.elementId === cardId);
        if (!card.assigned) {
            assignRole("Bottom", card);
            setTimeout(() => cpuTakeTurn("Left"), 500);
        } else if (detective === "Bottom" && !card.revealed) {
            detectiveGuess(cardId);
        }
    }

    // Simulate CPU turn
    function cpuTakeTurn(player) {
        let remainingCards = cards.filter(card => !card.assigned);
        if (remainingCards.length) {
            const card = remainingCards.splice(Math.floor(Math.random() * remainingCards.length), 1)[0];
            assignRole(player, card);
            if (player === "Left") {
                setTimeout(() => cpuTakeTurn("Top"), 500);
            } else if (player === "Top") {
                setTimeout(() => cpuTakeTurn("Right"), 500);
            } else {
                revealDetective();
            }
        }
    }

    // Assigns role to player
    function assignRole(player, card) {
        const roleElement = document.getElementById(`role${player}`);
        const cardElement = document.getElementById(card.elementId);
        if (roleElement && cardElement) {
            roleElement.innerText = card.name === "Detective" ? card.name : "?";
            cardElement.classList.add('picked');
            cardElement.innerText = `Picked by ${getPlayerName(player)}`;
            card.assigned = true;
            card.player = player;
            if (card.name === "Detective") {
                detective = player;
            }
        } else {
            console.error(`Element not found: role${player} or ${card.elementId}`);
        }
    }

    // Reveals the detective
    function revealDetective() {
        const detectiveCard = cards.find(card => card.name === "Detective");
        const cardElement = document.getElementById(detectiveCard.elementId);
        cardElement.classList.add('revealed');
        cardElement.innerText = "Detective";

        updateTargetIndicator();

        if (detective !== "Bottom") {
            setTimeout(cpuDetectiveGuess, 3000);
        }
    }

    // Updates target each turn
    function updateTargetIndicator() {
        const detectiveName = getPlayerName(detective);
        document.getElementById('target-indicator').innerText = `${detectiveName} must find the ${currentTarget}!`;
        document.getElementById('feedback').innerText = detective === "Bottom" ? `Please select the ${currentTarget}!` : `${detectiveName} is thinking...`;
    }

    function detectiveGuess(cardId) {
        const card = cards.find(c => c.elementId === cardId);
        checkGuess(card.player);
    }

    function cpuDetectiveGuess() {
        const players = ["Left", "Top", "Right", "Bottom"].filter(p => p !== detective);
        const guess = players[Math.floor(Math.random() * players.length)];
        checkGuess(guess);
    }

    // Reveals all roles
    function revealAllCards() {
        cards.forEach(card => {
            const cardElement = document.getElementById(card.elementId);
            cardElement.classList.add('revealed');
            cardElement.innerText = card.name;
            const roleElement = document.getElementById(`role${card.player}`);
            if (roleElement) {
                roleElement.innerText = card.name;
            }
        });
    }

    function updateScores(isCorrect, targetPlayer) {
        for (const player in scores) {
            const playerKey = player.replace('player', '');
            const card = cards.find(c => c.player === playerKey);
            if (card) {
                if (isCorrect) {
                    // Detective found the target, everyone except target gets points
                    if (playerKey !== targetPlayer) {
                        scores[player] += card.points;
                    }
                } else {
                    // Target wasn't found, everyone except detective gets points
                    if (playerKey !== detective) {
                        scores[player] += card.points;
                    }
                }
            }
        }
        updateScoreDisplay();
    }

    function checkGuess(guess) {
        const correctRole = cards.find(card => card.name === currentTarget);
        const isCorrect = correctRole.player === guess;

        revealAllCards();
        updateScores(isCorrect, correctRole.player);

        const detectiveName = getPlayerName(detective);
        const guessName = getPlayerName(guess);
        const correctName = getPlayerName(correctRole.player);

        let message;
        if (isCorrect) {
            message = `Correct guess! ${detectiveName} found the ${currentTarget}: ${guessName}. `;
            message += `Everyone except ${guessName} gets points.`;
        } else {
            message = `Incorrect guess! ${detectiveName} picked ${guessName} but the ${currentTarget} was ${correctName}. `;
            message += `Everyone except ${detectiveName} gets points.`;
        }

        document.getElementById('feedback').innerText = message;
        document.getElementById('nextTurn').style.display = "block";
    }

    function updateScoreDisplay() {
        for (const player in scores) {
            const playerKey = player.replace('player', '');
            const scoreElement = document.getElementById(`score${playerKey}`);
            if (scoreElement) {
                scoreElement.innerText = `${scores[player]} points`;
            }
        }
    }

    document.getElementById('nextTurn').addEventListener('click', () => {
        turnNumber += 1;
        document.getElementById('turnNumber').innerText = turnNumber;
        resetTurn();
    });

    function resetTurn() {
        shuffle(cards);
        const cardCenter = document.getElementById('card-center');
        cardCenter.innerHTML = '';
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.id = card.elementId;
            cardElement.className = 'card';
            cardElement.innerText = '?';
            cardCenter.appendChild(cardElement);
        });
        addCardEventListeners();
        cards.forEach(c => { delete c.assigned; delete c.player; delete c.revealed; });
        ["Left", "Top", "Right", "Bottom"].forEach(player => {
            const roleElement = document.getElementById(`role${player}`);
            if (roleElement) {
                roleElement.innerText = "";
            }
        });
        document.getElementById('nextTurn').style.display = "none";
        document.getElementById('target-indicator').innerText = "";
        document.getElementById('feedback').innerText = "";
        detective = "";
        updateTarget();
        checkForWinner();
    }

    function updateTarget() {
        if (currentTarget === "Thief") currentTarget = "Mob";
        else if (currentTarget === "Mob") currentTarget = "Serial Killer";
        else currentTarget = "Thief";
    }

    function checkForWinner() {
        for (const player in scores) {
            if (scores[player] >= 4000) {
                let winnerName = getPlayerName(player.replace('player', ''));
                let winnerMessage = `${winnerName} win(s) the game!`;
                document.getElementById('feedback').innerText = winnerMessage;
                setTimeout(() => {
                    alert(winnerMessage);
                    resetGame();
                }, 100);
                return;
            }
        }
    }

    function getPlayerName(player) {
        const names = {
            Left: "Sleuth 1",
            Top: "Sleuth 2",
            Right: "Sleuth 3",
            Bottom: "You"
        };
        return names[player] || player;
    }

    function resetGame() {
        turnNumber = 1;
        scores = { playerLeft: 0, playerTop: 0, playerRight: 0, playerBottom: 0 };
        currentTarget = "Thief";
        detective = "";
        document.getElementById('turnNumber').innerText = turnNumber;
        updateScoreDisplay();
        resetTurn();
    }

    resetGame();
</script>

</body>
</html>
```

The provided code implements a "Mystery Detective" game for four players (one human, three AI) using HTML, CSS, and JavaScript. It includes turn indicators, target information, and feedback messages to guide gameplay. 
Players take turns selecting cards representing different roles (Detective, Thief, Mob, Serial Killer), with the Detective immediately revealed. The Detective then guesses the location of a specific target criminal, which changes each round. 
The game features a central board displaying the cards, with players positioned around it. 
The first player to reach 4000 points wins, 
with the game state updating after each round and allowing for multiple plays.