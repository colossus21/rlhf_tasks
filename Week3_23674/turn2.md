I've improved the game based on your requirements. Here's the updated HTML file with all the requested changes:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elemental Clash</title>
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
            position: relative;
        }
        .choice {
            display: inline-block;
            margin: 10px;
            cursor: pointer;
        }
        .choice img {
            width: 100px;
            height: 100px;
        }
        #countdown, #result {
            font-size: 24px;
            margin: 20px 0;
        }
        #battle-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 400px;
            margin: 0 auto;
        }
        #player-choice, #ai-choice {
            width: 150px;
            height: 150px;
            transition: all 0.5s ease-in-out;
            visibility: hidden;
        }
        #player-choice {
            transform: translateX(-200px);
        }
        #ai-choice {
            transform: translateX(200px);
        }
        .revealed {
            transform: translateX(0) !important;
            visibility: visible;
        }
        .winner {
            transform: scale(1.2) translateX(-50%) !important;
            position: absolute;
            left: 50%;
            z-index: 10;
        }
        #how-to-play {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        #restart {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            display: none;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.4);
        }
        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 600px;
        }
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
    </style>
</head>
<body>
<div id="game-container">
    <button id="how-to-play">How to Play</button>
    <h1 id="game-title">Choose your move:</h1>
    <div id="choices">
        <div class="choice" onclick="makeChoice('earthquake')">
            <img src="earthquake.gif" alt="Earthquake">
            <p>Earthquake</p>
        </div>
        <div class="choice" onclick="makeChoice('tsunami')">
            <img src="tsunami.gif" alt="Tsunami">
            <p>Tsunami</p>
        </div>
        <div class="choice" onclick="makeChoice('firestorm')">
            <img src="firestorm.gif" alt="Firestorm">
            <p>Firestorm</p>
        </div>
    </div>
    <div id="countdown"></div>
    <div id="battle-container">
        <img id="player-choice" alt="Player's choice">
        <img id="ai-choice" alt="AI's choice">
    </div>
    <div id="result"></div>
    <button id="restart" onclick="restartGame()">Play Again</button>
</div>

<div id="modal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>How to Play Elemental Clash</h2>
        <p>1. Choose your move: Earthquake, Tsunami, or Firestorm.</p>
        <p>2. Wait for the countdown and see the AI's choice.</p>
        <p>3. The winner is determined as follows:</p>
        <ul>
            <li>Earthquake defeats Firestorm</li>
            <li>Tsunami defeats Earthquake</li>
            <li>Firestorm defeats Tsunami</li>
        </ul>
        <p>4. The winning move will be highlighted and move to the center.</p>
        <p>5. Click "Play Again" to start a new game.</p>
    </div>
</div>

<audio id="earthquake-sound" src="earthquake.wav"></audio>
<audio id="tsunami-sound" src="tsunami.wav"></audio>
<audio id="firestorm-sound" src="firestorm.wav"></audio>
<audio id="tick-sound" src="tick.wav"></audio>

<script>
    const choices = ['earthquake', 'tsunami', 'firestorm'];
    let playerChoice, aiChoice;

    const modal = document.getElementById("modal");
    const howToPlayBtn = document.getElementById("how-to-play");
    const closeBtn = document.getElementsByClassName("close")[0];

    howToPlayBtn.onclick = function() {
        modal.style.display = "block";
    }

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function makeChoice(choice) {
        playerChoice = choice;
        document.getElementById(`${choice}-sound`).play();
        document.getElementById('choices').style.display = 'none';
        document.getElementById('game-title').textContent = "Elemental Showdown";
        startCountdown();
    }

    function startCountdown() {
        let count = 3;
        const countdownElement = document.getElementById('countdown');
        const tickSound = document.getElementById('tick-sound');

        const countdownInterval = setInterval(() => {
            countdownElement.textContent = count;
            tickSound.play();
            count--;

            if (count < 0) {
                clearInterval(countdownInterval);
                countdownElement.textContent = '';
                revealChoices();
            }
        }, 1000);
    }

    function revealChoices() {
        aiChoice = choices[Math.floor(Math.random() * choices.length)];

        const playerChoiceElement = document.getElementById('player-choice');
        const aiChoiceElement = document.getElementById('ai-choice');

        playerChoiceElement.src = `${playerChoice}.gif`;
        aiChoiceElement.src = `${aiChoice}.gif`;

        playerChoiceElement.style.visibility = 'visible';
        aiChoiceElement.style.visibility = 'visible';

        setTimeout(() => {
            playerChoiceElement.classList.add('revealed');
            aiChoiceElement.classList.add('revealed');
        }, 100);

        setTimeout(determineWinner, 1000);
    }

    function determineWinner() {
        const resultElement = document.getElementById('result');
        const playerChoiceElement = document.getElementById('player-choice');
        const aiChoiceElement = document.getElementById('ai-choice');

        if (playerChoice === aiChoice) {
            resultElement.textContent = "It's a tie!";
        } else if (
            (playerChoice === 'earthquake' && aiChoice === 'firestorm') ||
            (playerChoice === 'tsunami' && aiChoice === 'earthquake') ||
            (playerChoice === 'firestorm' && aiChoice === 'tsunami')
        ) {
            resultElement.textContent = "You win!";
            playerChoiceElement.classList.add('winner');
            aiChoiceElement.classList.remove('revealed');
            setTimeout(() => aiChoiceElement.style.opacity = '0', 500);
        } else {
            resultElement.textContent = "AI wins!";
            aiChoiceElement.classList.add('winner');
            playerChoiceElement.classList.remove('revealed');
            setTimeout(() => playerChoiceElement.style.opacity = '0', 500);
        }

        document.getElementById('restart').style.display = 'inline-block';
    }

    function restartGame() {
        document.getElementById('choices').style.display = 'block';
        const playerChoiceElement = document.getElementById('player-choice');
        const aiChoiceElement = document.getElementById('ai-choice');
        
        playerChoiceElement.style.visibility = 'hidden';
        playerChoiceElement.style.opacity = '1';
        
        aiChoiceElement.style.visibility = 'hidden';
        aiChoiceElement.style.opacity = '1';

        playerChoiceElement.className = '';
        aiChoiceElement.className = '';

        document.getElementById('result').textContent = '';
        document.getElementById('game-title').textContent = "Choose your move:";
        document.getElementById('restart').style.display = 'none';
    }
</script>
</body>
</html>
```

This updated version includes all the requested improvements:

- A "How to Play" button is added to the top right corner. When clicked, it opens a modal with game instructions.
- The initial screen now shows "Choose your move:" instead of the game name. After a choice is made, it changes to "Elemental Showdown".
- When both players clash in the second round, the winning player's image moves to the center.
- A restart button appears at the bottom after the winner is decided.
- The entire game is contained in a single HTML file.

To use this file:

1. Save it as an HTML file (e.g., `elemental_clash.html`).
2. Make sure you have the following image and audio files in the same directory as the HTML file:
    - `earthquake.gif`, `tsunami.gif`, `firestorm.gif`
    - `earthquake.wav`, `tsunami.wav`, `firestorm.wav`, `tick.wav`
3. Open the HTML file in a web browser to play the game.

This improved version offers a more complete and interactive gaming experience with clear instructions and the ability to restart the game easily.