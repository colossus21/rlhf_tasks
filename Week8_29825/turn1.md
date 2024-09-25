### Code Plan:

1. UI Components:
   1. Game title: "Shape Chasers"
   2. Player indicators and goal sequences display
   3. 9x9 game grid
   4. Turn and shuffle counter
   5. Winner message (when game ends)
   6. Restart button

2. Gameplay:
   1. Game initialization
   2. Player movement and turn management
   3. Shape collection and goal tracking
   4. Board state management and shape shuffling
   5. Win condition checking

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shape Chasers</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }
        #game-container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
        }
        #board {
            display: grid;
            grid-template-columns: repeat(9, 50px);
            grid-template-rows: repeat(9, 50px);
            gap: 1px;
            margin: 20px auto;
            background-color: #ddd;
            padding: 5px;
            border-radius: 5px;
            justify-content: center;
        }
        .cell {
            width: 50px;
            height: 50px;
            background-color: #fff;
            border: 1px solid #ccc;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
        }
        .player {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            font-weight: bold;
            color: white;
        }
        .player1 {
            background-color: #ff4136;
        }
        .player2 {
            background-color: #0074d9;
        }
        #goals {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            width: 100%;
        }
        .goal-sequence {
            display: flex;
            gap: 10px;
            background-color: #f8f8f8;
            padding: 10px;
            border-radius: 5px;
        }
        #turn-counter, #winner {
            text-align: center;
            margin-top: 20px;
            font-size: 18px;
        }
        #restart-button {
            display: block;
            margin: 20px auto 0;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            background-color: #ffcccb;
            color: #333;
            border: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        #restart-button:hover {
            background-color: #ffb3b3;
        }
        #current-player, #turn-counter {
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
            font-weight: bold;
        }
        #current-player {
            margin-bottom: 20px;
        }
        #current-player span {
            color: #ff4136;
        }
        #current-player span.blue {
            color: #0074d9;
        }
    </style>
</head>
<body>
<div id="game-container">
    <h1>Shape Chasers</h1>
    <div id="current-player">Current Player: <span>Player 1 (Red)</span></div>
    <div id="goals">
        <div>Player 1 (Red) Goal: <div id="p1-goal" class="goal-sequence"></div></div>
        <div>Player 2 (Blue) Goal: <div id="p2-goal" class="goal-sequence"></div></div>
    </div>
    <div id="board"></div>
    <div id="turn-counter">Shapes are shuffled in: <span id="turns-left">10</span> turns</div>
    <div id="winner"></div>
    <button id="restart-button" style="display: none;">Restart Game</button>
</div>

<script>
    const BOARD_SIZE = 9;
    const SHAPES = ['🔶', '🔷', '🔴', '🔵', '⭐', '💠', '🔺', '🔻', '🟥', '🟦', '🟩', '🟨'];
    const GOAL_LENGTH = 5;
    const SPAWN_COUNT = 12;
    const TURNS_UNTIL_SHUFFLE = 10;

    let board = [];
    let player1 = { row: 0, col: 0, goal: [], collected: [] };
    let player2 = { row: 8, col: 8, goal: [], collected: [] };
    let shapePositions = [];
    let gameOver = false;
    let currentPlayer = 1;
    let turnsLeft = TURNS_UNTIL_SHUFFLE;

    function initGame() {
        board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
        player1 = { row: 0, col: 0, goal: [], collected: [] };
        player2 = { row: 8, col: 8, goal: [], collected: [] };
        gameOver = false;
        currentPlayer = 1;
        turnsLeft = TURNS_UNTIL_SHUFFLE;

        player1.goal = generateGoal();
        player2.goal = generateGoal();

        updatePlayerGoal('p1-goal', player1.goal);
        updatePlayerGoal('p2-goal', player2.goal);

        createBoard();
        spawnShapes();
        updateTurnCounter();

        document.getElementById('winner').textContent = '';
        document.getElementById('restart-button').style.display = 'none';
        updateCurrentPlayerDisplay();
    }

    function createBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                boardElement.appendChild(cell);
            }
        }
        updateBoard();
    }

    function updateBoard() {
        const cells = document.querySelectorAll('.cell');
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const index = i * BOARD_SIZE + j;
                cells[index].textContent = board[i][j] || '';
                cells[index].className = 'cell';
                if (i === player1.row && j === player1.col) {
                    cells[index].innerHTML = '<div class="player player1">P1</div>';
                } else if (i === player2.row && j === player2.col) {
                    cells[index].innerHTML = '<div class="player player2">P2</div>';
                }
            }
        }
    }

    function generateGoal() {
        return shuffle(SHAPES).slice(0, GOAL_LENGTH);
    }

    function updatePlayerGoal(elementId, goal) {
        const goalElement = document.getElementById(elementId);
        goalElement.innerHTML = goal.map(shape => `<span>${shape}</span>`).join('');
    }

    function spawnShapes() {
        shapePositions = [];
        const playerGoals = [...player1.goal, ...player2.goal];
        const remainingShapes = shuffle(SHAPES.filter(shape => !playerGoals.includes(shape)));
        const allShapes = [...playerGoals, ...remainingShapes.slice(0, SPAWN_COUNT - playerGoals.length)];
        const availableCells = [];

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if ((i !== player1.row || j !== player1.col) && (i !== player2.row || j !== player2.col)) {
                    availableCells.push([i, j]);
                }
            }
        }

        shuffle(availableCells);

        for (let i = 0; i < SPAWN_COUNT; i++) {
            const [row, col] = availableCells[i];
            board[row][col] = allShapes[i];
            shapePositions.push({ row, col, shape: allShapes[i] });
        }

        updateBoard();
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function movePlayer(player, rowDelta, colDelta) {
        if (gameOver) return;
        if ((player === player1 && currentPlayer !== 1) || (player === player2 && currentPlayer !== 2)) return;

        const newRow = player.row + rowDelta;
        const newCol = player.col + colDelta;

        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
            player.row = newRow;
            player.col = newCol;

            if (board[newRow][newCol]) {
                const collectedShape = board[newRow][newCol];
                player.collected.push(collectedShape);
                board[newRow][newCol] = null;

                const goalIndex = player.goal.indexOf(collectedShape);
                if (goalIndex !== -1 && goalIndex === player.collected.length - 1) {
                    if (player.collected.length === GOAL_LENGTH) {
                        endGame(player === player1 ? 'Player 1 (Red)' : 'Player 2 (Blue)');
                        return;
                    }
                } else {
                    player.collected = [];
                }

                updatePlayerGoal(player === player1 ? 'p1-goal' : 'p2-goal', player.goal.map((shape, index) =>
                    index < player.collected.length ? '✅' : shape
                ));
            }

            updateBoard();
            switchPlayer();
            decrementTurns();
        }
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateCurrentPlayerDisplay();
    }

    function updateCurrentPlayerDisplay() {
        const currentPlayerElement = document.getElementById('current-player');
        const playerSpan = currentPlayerElement.querySelector('span');
        if (currentPlayer === 1) {
            playerSpan.textContent = 'Player 1 (Red)';
            playerSpan.className = '';
        } else {
            playerSpan.textContent = 'Player 2 (Blue)';
            playerSpan.className = 'blue';
        }
    }

    function decrementTurns() {
        turnsLeft--;
        updateTurnCounter();
        if (turnsLeft === 0) {
            changeShapePositions();
            turnsLeft = TURNS_UNTIL_SHUFFLE;
            updateTurnCounter();
        }
    }

    function updateTurnCounter() {
        document.getElementById('turns-left').textContent = turnsLeft;
    }

    function changeShapePositions() {
        for (let pos of shapePositions) {
            board[pos.row][pos.col] = null;
        }

        const availableCells = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if ((i !== player1.row || j !== player1.col) && (i !== player2.row || j !== player2.col) && !board[i][j]) {
                    availableCells.push([i, j]);
                }
            }
        }

        shuffle(availableCells);

        for (let i = 0; i < shapePositions.length; i++) {
            const [row, col] = availableCells[i];
            board[row][col] = shapePositions[i].shape;
            shapePositions[i] = { row, col, shape: shapePositions[i].shape };
        }

        updateBoard();
    }

    function endGame(winner) {
        gameOver = true;
        document.getElementById('winner').textContent = `${winner} wins!`;
        document.getElementById('restart-button').style.display = 'inline-block';
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'w': movePlayer(player1, -1, 0); break;
            case 'a': movePlayer(player1, 0, -1); break;
            case 's': movePlayer(player1, 1, 0); break;
            case 'd': movePlayer(player1, 0, 1); break;
            case 'ArrowUp': movePlayer(player2, -1, 0); break;
            case 'ArrowLeft': movePlayer(player2, 0, -1); break;
            case 'ArrowDown': movePlayer(player2, 1, 0); break;
            case 'ArrowRight': movePlayer(player2, 0, 1); break;
        }
    });

    document.getElementById('restart-button').addEventListener('click', initGame);

    initGame();
</script>
</body>
</html>
```

### Explanation:

1. Game Setup:
   1. Creates a 9x9 grid using HTML and CSS
   2. Initializes player positions: P1 (red) at top-left, P2 (blue) at bottom-right
   3. Generates random goal sequences of 5 shapes/emojis for each player
   4. Spawns 12 shapes on the board, ensuring 10 are from players' goals

2. Player Movement:
   1. Implements turn-based movement using WASD (P1) and arrow keys (P2)
   2. Allows one move per turn, alternating between players
   3. Updates player positions and checks for shape collection after each move

3. Shape Collection:
   1. Checks if the collected shape matches the next in the player's sequence
   2. Marks shapes as collected if correct, resets collection if incorrect
   3. Updates the visual representation of collected shapes in the player's goal display

4. Board Management:
   1. Shuffles shape positions every 10 turns
   2. Maintains a turn counter, visible to players
   3. Ensures shapes remain on the board after shuffling, preserving game state

5. Winning and Restarting:
   1. Checks for win condition after each shape collection
   2. Displays a winner message when a player collects all 5 shapes in sequence
   3. Shows a restart button upon game completion

This implementation creates an engaging, turn-based strategy game in which the players race for completing a set of shapes in sequence.