### Code Plan:

1. UI:
    - Create a canvas with 20 columns representing numbers 1-20.
    - Add player indicators for Player 1 (red) and Player 2 (blue).
    - Display "Say Next" and "Say Next Two" buttons.
    - Show game status and winner announcement area.

2. Gameplay:
    - Player 1 starts the game by clicking "Say Next" or "Say Next Two". Switches after each click.
    - Player who reaches 20 first wins the game.

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>1-20 Counting Game</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        .game-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        canvas {
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .controls {
            display: flex;
            gap: 15px;
            margin-top: 20px;
        }
        button {
            padding: 12px 25px;
            font-size: 16px;
            cursor: pointer;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        button:hover {
            background-color: #45a049;
            transform: translateY(-2px);
        }
        button:active {
            transform: translateY(0);
        }
        button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        .status {
            margin-top: 20px;
            font-size: 20px;
            font-weight: bold;
            color: #333;
        }
        .player-info {
            display: flex;
            justify-content: space-around;
            width: 100%;
            margin-bottom: 20px;
        }
        .player-card {
            display: flex;
            align-items: center;
            padding: 10px 20px;
            background-color: #f0f0f0;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .player-indicator {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 10px;
        }
    </style>
</head>
<body>
<div class="game-container">
    <h1>1-20 Counting Game</h1>
    <div class="player-info">
        <div class="player-card">
            <div class="player-indicator" style="background-color: #FF5252;"></div>
            <span>Player 1</span>
        </div>
        <div class="player-card">
            <div class="player-indicator" style="background-color: #448AFF;"></div>
            <span>Player 2</span>
        </div>
    </div>
    <canvas id="gameCanvas" width="800" height="100"></canvas>
    <div class="controls">
        <button onclick="makeMove(1)" id="move1">Say Next</button>
        <button onclick="makeMove(2)" id="move2">Say Next Two</button>
    </div>
    <div class="status" id="status"></div>
</div>

<script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const status = document.getElementById('status');
    const move1Btn = document.getElementById('move1');
    const move2Btn = document.getElementById('move2');

    const TOTAL_NUMBERS = 20;
    const BOX_WIDTH = canvas.width / TOTAL_NUMBERS;
    const BOX_HEIGHT = canvas.height;

    let currentNumber = 0;
    let currentPlayer = 1;
    let numberColors = new Array(TOTAL_NUMBERS).fill(null);

    function drawBoxes() {
        for (let i = 0; i < TOTAL_NUMBERS; i++) {
            ctx.fillStyle = numberColors[i] || '#FFFFFF';
            ctx.fillRect(i * BOX_WIDTH, 0, BOX_WIDTH, BOX_HEIGHT);
            ctx.strokeRect(i * BOX_WIDTH, 0, BOX_WIDTH, BOX_HEIGHT);

            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i + 1, i * BOX_WIDTH + BOX_WIDTH / 2, BOX_HEIGHT / 2);
        }
    }

    function updateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoxes();
    }

    function makeMove(count) {
        const playerColor = currentPlayer === 1 ? '#FF5252' : '#448AFF';
        for (let i = 0; i < count; i++) {
            if (currentNumber < TOTAL_NUMBERS) {
                numberColors[currentNumber] = playerColor;
                currentNumber++;
            }
            if (currentNumber >= TOTAL_NUMBERS) {
                endGame();
                return;
            }
        }
        switchPlayer();
        updateCanvas();
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateStatus();
    }

    function updateStatus() {
        status.textContent = `Player ${currentPlayer}'s turn. Current number: ${currentNumber}`;
        status.style.color = currentPlayer === 1 ? '#FF5252' : '#448AFF';
    }

    function endGame() {
        updateCanvas();
        status.textContent = `Player ${currentPlayer} wins!`;
        status.style.color = currentPlayer === 1 ? '#FF5252' : '#448AFF';
        move1Btn.disabled = true;
        move2Btn.disabled = true;
    }

    updateCanvas();
    updateStatus();
</script>
</body>
</html>
```

### Explanation:

1. UI:
    - Structured game container with custom CSS styles is implemented for visual appeal.
    - Responsive design with gradients and shadows are used for the background.
    - Player turn indicator with colored boxes is implemented—red for Player 1 and blue for Player 2.
    - Two buttons: "Say Next" and "Say Next Two" are implemented.

2. Logic Implementation:
    - Game state tracks current number, player, and box colors.
    - Canvas drawing function creates 20 numbered boxes.
    - `makeMove()` handles player actions, updates game state
    - `switchPlayer()` alternates turns.
    - `updateStatus()` shows current player and number.
    - `endGame()` announces winner and disables buttons.

This implementation creates an interactive 1-20 Counting Game providing an engaging two-player experience.