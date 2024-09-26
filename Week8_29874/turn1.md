### Code Plan:

UI:
- Create a main container for the game
- Add a title "Food Habits" at the top of the container
- Create a turn indicator section above the game grid
- Design a 9x9 grid for the game board
- Add an animal selection area with 5 buttons for each animal emoji
- Create a score display section below the game grid
- Add a winner declaration area below the score display
- Include a restart button at the bottom of the container

Gameplay:
- Initialize the game board with 51 random food emojis
- Implement turn-based gameplay for two players
- Create a function to handle animal selection
- Develop a function to place selected animals on the board
- Implement a scoring system based on surrounding food
- Create a function to check for game end condition
- Develop a win condition checker and winner declaration
- Implement a game restart functionality

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Food Habits Game</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
            background-color: #f0f8ff;
            color: #333;
        }
        #game-container {
            text-align: center;
            background-color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        #turn-indicator {
            font-size: 24px;
            margin-bottom: 15px;
            font-weight: bold;
            color: #ffd692;
        }
        #board {
            display: grid;
            grid-template-columns: repeat(9, 60px);
            gap: 4px;
            margin: 20px auto;
            background-color: #ecf0f1;
            padding: 10px;
            border-radius: 10px;
        }
        .cell {
            width: 60px;
            height: 60px;
            background-color: #fff;
            border: 2px solid #bdc3c7;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 8px;
        }
        .cell:hover {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .cell.player1 { background-color: rgba(231, 76, 60, 0.3); }
        .cell.player2 { background-color: rgba(52, 152, 219, 0.3); }
        #score, #winner {
            font-size: 20px;
            margin-top: 15px;
            font-weight: bold;
        }
        #restart-button {
            font-size: 18px;
            margin: 20px auto;
            padding: 10px 20px;
            cursor: pointer;
            background-color: #2ecc71;
            color: white;
            border: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        #restart-button:hover {
            background-color: #27ae60;
        }
        #animal-selection {
            margin-top: 15px;
            background-color: #ecf0f1;
            padding: 10px;
            border-radius: 10px;
        }
        .animal-button {
            font-size: 30px;
            margin: 0 5px;
            padding: 5px 15px;
            cursor: pointer;
            background-color: #fff;
            border: 2px solid #bdc3c7;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        .animal-button:hover {
            transform: scale(1.1);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .animal-button.selected {
            border-color: #3498db;
            box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
        }
    </style>
</head>
<body>
<div id="game-container">
    <h1>🍽️ Food Habits Game 🐾</h1>
    <div id="turn-indicator">Player 1's turn</div>
    <div id="animal-selection">
        <button class="animal-button" data-animal="🐘">🐘</button>
        <button class="animal-button" data-animal="🐱">🐱</button>
        <button class="animal-button" data-animal="🐼">🐼</button>
        <button class="animal-button" data-animal="🐧">🐧</button>
        <button class="animal-button" data-animal="🦒">🦒</button>
    </div>
    <div id="board"></div>
    <div id="score">Player 1: 0 | Player 2: 0</div>
    <div id="winner"></div>
    <button id="restart-button" style="display: none;">Restart Game</button>
</div>

<script>
    const BOARD_SIZE = 9;
    const ANIMALS = ['🐘', '🐱', '🐼', '🐧', '🦒'];
    const FOODS = ['🍃', '🍎', '🐟', '🍖', '🎋', '🦑', '🌳'];
    const ANIMAL_FOODS = {
        '🐘': ['🍃', '🍎'],
        '🐱': ['🐟', '🍖'],
        '🐼': ['🎋', '🍃'],
        '🐧': ['🐟', '🦑'],
        '🦒': ['🍃', '🌳']
    };

    let board = [];
    let currentPlayer = 1;
    let scores = [0, 0];
    let emptyCells;
    let selectedAnimal = null;

    function initializeGame() {
        board = [];
        emptyCells = BOARD_SIZE * BOARD_SIZE;
        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (Math.random() < 0.63) {  // 51 / 81 ≈ 0.63
                    board[i][j] = FOODS[Math.floor(Math.random() * FOODS.length)];
                    emptyCells--;
                } else {
                    board[i][j] = null;
                }
            }
        }
        currentPlayer = 1;
        scores = [0, 0];
        selectedAnimal = null;
        updateBoard();
        updateScore();
        updateTurnIndicator();
        document.getElementById('winner').textContent = '';
        document.getElementById('restart-button').style.display = 'none';
        document.querySelectorAll('.animal-button').forEach(btn => btn.classList.remove('selected'));
    }

    function createBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.addEventListener('click', () => handleCellClick(i, j));
                boardElement.appendChild(cell);
            }
        }
    }

    function updateBoard() {
        const cells = document.querySelectorAll('.cell');
        board.flat().forEach((cell, index) => {
            cells[index].textContent = cell || '';
            cells[index].className = 'cell';
        });
    }

    function handleCellClick(row, col) {
        if (board[row][col] === null && selectedAnimal) {
            board[row][col] = selectedAnimal;
            const cell = document.querySelectorAll('.cell')[row * BOARD_SIZE + col];
            cell.textContent = selectedAnimal;
            cell.classList.add(currentPlayer === 1 ? 'player1' : 'player2');
            const points = calculatePoints(row, col, selectedAnimal);
            scores[currentPlayer - 1] += points;
            updateScore();
            emptyCells--;
            if (emptyCells === 0) {
                endGame();
            } else {
                currentPlayer = 3 - currentPlayer;  // Switch between 1 and 2
                updateTurnIndicator();
            }
            selectedAnimal = null;
            document.querySelectorAll('.animal-button').forEach(btn => btn.classList.remove('selected'));
        }
    }

    function calculatePoints(row, col, animal) {
        let points = 0;
        for (let i = Math.max(0, row - 1); i <= Math.min(BOARD_SIZE - 1, row + 1); i++) {
            for (let j = Math.max(0, col - 1); j <= Math.min(BOARD_SIZE - 1, col + 1); j++) {
                if (i !== row || j !== col) {
                    if (ANIMAL_FOODS[animal].includes(board[i][j])) {
                        points++;
                    }
                }
            }
        }
        return points;
    }

    function updateScore() {
        document.getElementById('score').textContent = `Player 1: ${scores[0]} | Player 2: ${scores[1]}`;
    }

    function updateTurnIndicator() {
        const indicator = document.getElementById('turn-indicator');
        indicator.textContent = `Player ${currentPlayer}'s turn`;
        indicator.style.color = currentPlayer === 1 ? '#e74c3c' : '#3498db';
    }

    function endGame() {
        const winner = scores[0] > scores[1] ? 1 : (scores[1] > scores[0] ? 2 : 'Tie');
        const winnerElement = document.getElementById('winner');
        if (winner === 'Tie') {
            winnerElement.textContent = "It's a tie!";
            winnerElement.style.color = '#f39c12';
        } else {
            winnerElement.textContent = `Player ${winner} wins!`;
            winnerElement.style.color = winner === 1 ? '#e74c3c' : '#3498db';
        }
        document.getElementById('restart-button').style.display = 'block';
    }

    document.getElementById('restart-button').addEventListener('click', initializeGame);

    document.querySelectorAll('.animal-button').forEach(button => {
        button.addEventListener('click', () => {
            selectedAnimal = button.dataset.animal;
            document.querySelectorAll('.animal-button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    createBoard();
    initializeGame();
</script>
</body>
</html>
```

### Explanation:

- The game uses a 9x9 grid to represent the game board
- Two players take turns placing animal emojis on the board
- There are 5 animal emojis available: Elephant, Cat, Panda, Penguin, and Giraffe
- Each animal has 2 favorite food types
- 51 cells of the board are pre-filled with random food emojis
- Players score points based on the favorite foods in the 8 surrounding cells
- The game board uses light red and blue backgrounds to indicate player moves
- A turn indicator shows which player's turn it is
- The score is displayed below the game board
- The game ends when all cells are filled
- The player with the highest score wins
- A winner is declared at the end of the game
- A restart button allows players to start a new game
- The game logic handles turn switching, scoring, and win conditions
- Animal selection is done through buttons with emoji representations

This plan implements a simple yet fun strategic game called "Food Habits".