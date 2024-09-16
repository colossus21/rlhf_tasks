### Code Plan:

1. UI Components:
   1. Game title
   2. 6x6 grid of letter cells
   3. Word display area
   4. Score display
   5. Shuffle button (top-left corner)
   6. End Game button (top-right corner)
   7. Confirm Word button
   8. Clear Selection button
   9. Message area for feedback
   10. Word information display with carousel
   11. Game over screen with final score, word list, and restart button

2. Gameplay:
   1. Initialize the game board with random letters
   2. Handle letter selection and deselection
   3. Validate words using the Dictionary API
   4. Update score and highlight found words
   5. Implement shuffling of remaining letters
   6. Handle game end conditions (all cells used or end game button pressed)
   7. Display word information in a carousel
   8. Implement game restart functionality

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grid Words</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: #333;
        }
        #game-container {
            text-align: center;
            background-color: white;
            padding: 2rem 10rem;
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            max-width: 600px;
            width: 100%;
            position: relative;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 1rem;
        }
        #board {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 8px;
            margin: 1rem auto;
            max-width: 400px;
        }
        .cell {
            aspect-ratio: 1;
            border: 2px solid #3498db;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            background-color: white;
        }
        .cell:hover {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
        }
        .selected {
            background-color: #f39c12;
            color: white;
        }
        .found {
            background-color: #2ecc71;
            color: white;
            cursor: not-allowed;
        }
        #word-display {
            font-size: 1.5rem;
            margin: 1rem 0;
            min-height: 2rem;
            color: #2c3e50;
        }
        #score-display {
            font-size: 1.2rem;
            margin: 1rem 0;
            color: #2c3e50;
        }
        button {
            margin: 0.5rem;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            cursor: pointer;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        button:hover {
            background-color: #2980b9;
        }
        #message {
            font-size: 1rem;
            margin: 1rem 0;
            min-height: 1.5rem;
            color: #27ae60;
        }
        .loading {
            display: inline-block;
            width: 1.5rem;
            height: 1.5rem;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        #word-info {
            display: none;
            margin-top: 2rem;
            text-align: left;
            background-color: #ecf0f1;
            padding: 1rem;
            border-radius: 8px;
        }
        #word-info h3 {
            margin-top: 0;
            color: #2c3e50;
        }
        #word-info p {
            margin: 0.5rem 0;
            font-size: 0.9rem;
        }
        .corner-button {
            position: absolute;
            top: 10px;
            padding: 0.5rem;
            font-size: 0.8rem;
            background-color: #95a5a6;
        }
        #shuffle-button {
            left: 10px;
        }
        #end-game-button {
            right: 10px;
        }
        #game-over {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        #game-over-content {
            background-color: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
        }
        #found-words-list {
            max-height: 150px;
            overflow-y: auto;
            margin: 1rem 0;
            padding: 0.5rem;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        #meaning-carousel {
            position: relative;
        }
        #meaning-content {
            min-height: 60px;
        }
        .carousel-controls {
            display: flex;
            justify-content: center;
            margin-top: 10px;
        }
        .carousel-button {
            background-color: transparent;
            color: #95a5a6;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0 10px;
            transition: color 0.3s ease;
        }
        .carousel-button:hover {
            color: #7f8c8d;
        }
        #meaning-counter {
            font-size: 0.8rem;
            color: #95a5a6;
            margin: 0 10px;
            padding-top: 13px;
        }
    </style>
</head>
<body>
<div id="game-container">
    <h1>Grid Words</h1>
    <button id="shuffle-button" class="corner-button">Shuffle</button>
    <button id="end-game-button" class="corner-button">End Game</button>
    <div id="board"></div>
    <div id="word-display"></div>
    <div id="score-display">Score: 0</div>
    <button id="confirm-button">Confirm Word</button>
    <button id="clear-button">Clear Selection</button>
    <div id="message"></div>
    <div id="word-info">
        <h3 id="word-title"></h3>
        <p id="word-phonetic"></p>
        <div id="meaning-carousel">
            <div id="meaning-content"></div>
            <div class="carousel-controls">
                <button id="prev-meaning" class="carousel-button">&#8249;</button>
                <span id="meaning-counter"></span>
                <button id="next-meaning" class="carousel-button">&#8250;</button>
            </div>
        </div>
    </div>
</div>

<script>
    const BOARD_SIZE = 6;
    const LETTERS = 'AAABCDEEEEFGHIIIJKLMNOOOPQRSTUUVWXYZ';
    let board = [];
    let selectedCells = [];
    let score = 0;
    let foundWords = new Set();
    let gameOver = false;
    let currentMeaningIndex = 0;
    let currentWordMeanings = [];

    function createBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => handleCellClick(i, j));
                boardElement.appendChild(cell);
                const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
                cell.textContent = letter;
                board[i][j] = letter;
            }
        }
    }

    function handleCellClick(row, col) {
        if (gameOver) return;
        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cellElement.classList.contains('found')) return;

        const index = selectedCells.findIndex(cell => cell.row === row && cell.col === col);

        if (index === -1) {
            selectedCells.push({ row, col });
            cellElement.classList.add('selected');
        } else {
            selectedCells.splice(index, 1);
            cellElement.classList.remove('selected');
        }

        updateWordDisplay();
    }

    function updateWordDisplay() {
        const wordDisplay = document.getElementById('word-display');
        const word = selectedCells.map(cell => board[cell.row][cell.col]).join('');
        wordDisplay.textContent = word;
    }

    async function confirmWord() {
        if (gameOver) return;
        const word = selectedCells.map(cell => board[cell.row][cell.col]).join('');
        const messageElement = document.getElementById('message');

        if (word.length < 3) {
            messageElement.textContent = 'Word must be at least 3 letters long.';
            return;
        }

        if (foundWords.has(word)) {
            messageElement.textContent = 'Word already found!';
            return;
        }

        messageElement.innerHTML = '<div class="loading"></div> Checking word...';

        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                score += word.length;
                updateScore();
                messageElement.textContent = `Valid word! +${word.length} points.`;
                foundWords.add(word);
                highlightFoundWord();
                displayWordInfo(data[0]);
                checkGameEnd();
            } else {
                messageElement.textContent = 'Not a valid word. Try again.';
            }
        } catch (error) {
            messageElement.textContent = 'Not a valid word or error occurred. Please try again.';
        }

        clearSelection();
    }

    function highlightFoundWord() {
        selectedCells.forEach(cell => {
            const cellElement = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
            cellElement.classList.add('found');
        });
    }

    function displayWordInfo(wordData) {
        const wordInfoElement = document.getElementById('word-info');
        wordInfoElement.style.display = 'block';

        document.getElementById('word-title').textContent = wordData.word;
        document.getElementById('word-phonetic').textContent = wordData.phonetic || '';

        currentWordMeanings = wordData.meanings;
        currentMeaningIndex = 0;
        updateMeaningDisplay();
    }

    function updateMeaningDisplay() {
        const meaningContent = document.getElementById('meaning-content');
        const currentMeaning = currentWordMeanings[currentMeaningIndex];
        meaningContent.innerHTML = `
            <p><strong>${currentMeaning.partOfSpeech}:</strong> ${currentMeaning.definitions[0].definition}</p>
        `;
        document.getElementById('meaning-counter').textContent = `${currentMeaningIndex + 1} / ${currentWordMeanings.length}`;
    }

    function clearSelection() {
        selectedCells.forEach(cell => {
            const cellElement = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
            if (!cellElement.classList.contains('found')) {
                cellElement.classList.remove('selected');
            }
        });
        selectedCells = [];
        updateWordDisplay();
    }

    function updateScore() {
        const scoreDisplay = document.getElementById('score-display');
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function shuffleBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            if (!cell.classList.contains('found')) {
                const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
                cell.textContent = letter;
                board[cell.dataset.row][cell.dataset.col] = letter;
            }
        });
        clearSelection();
    }

    function checkGameEnd() {
        const allCells = document.querySelectorAll('.cell');
        const allFound = Array.from(allCells).every(cell => cell.classList.contains('found'));
        if (allFound) {
            endGame();
        }
    }

    function endGame() {
        gameOver = true;
        const gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'game-over';
        gameOverScreen.innerHTML = `
            <div id="game-over-content">
                <h2>Game Over!</h2>
                <p>Your final score: ${score}</p>
                <div id="found-words-list">
                    <h3>Words Found:</h3>
                    ${Array.from(foundWords).map(word => `<p>${word}</p>`).join('')}
                </div>
                <button id="restart-button">Restart Game</button>
            </div>
        `;
        document.body.appendChild(gameOverScreen);
        document.getElementById('restart-button').addEventListener('click', restartGame);
    }

    function restartGame() {
        document.body.removeChild(document.getElementById('game-over'));
        gameOver = false;
        score = 0;
        foundWords.clear();
        createBoard();
        updateScore();
        document.getElementById('word-info').style.display = 'none';
        document.getElementById('message').textContent = '';
    }

    document.getElementById('confirm-button').addEventListener('click', confirmWord);
    document.getElementById('clear-button').addEventListener('click', clearSelection);
    document.getElementById('shuffle-button').addEventListener('click', shuffleBoard);
    document.getElementById('end-game-button').addEventListener('click', endGame);
    document.getElementById('prev-meaning').addEventListener('click', () => {
        currentMeaningIndex = (currentMeaningIndex - 1 + currentWordMeanings.length) % currentWordMeanings.length;
        updateMeaningDisplay();
    });
    document.getElementById('next-meaning').addEventListener('click', () => {
        currentMeaningIndex = (currentMeaningIndex + 1) % currentWordMeanings.length;
        updateMeaningDisplay();
    });

    createBoard();
</script>
</body>
</html>
```

### Explanation:

1. Board Creation:
    - The `createBoard()` function generates a 6x6 grid of cells.
    - Each cell is populated with a random letter, with common letters having a higher probability.

2. Letter Selection:
    - The `handleCellClick()` function manages the selection/deselection of letters.
    - Selected cells are highlighted and added to the `selectedCells` array.

3. Word Validation:
    - The `confirmWord()` function checks if the formed word is valid using the provided API.
    - It uses a try-catch block to handle potential 404 errors for invalid words.
    - Valid words increase the score based on their length.

4. Score and Found Words:
    - The `updateScore()` function keeps track of the player's score.
    - Found words are highlighted using the `highlightFoundWord()` function and made non-reusable.

5. Shuffle and End Game:
    - The `shuffleBoard()` function randomizes the remaining letters when the shuffle button is clicked.
    - The `endGame()` function is called when the end game button is pressed or all cells are used.

6. Word Information Display:
    - The `displayWordInfo()` function shows the word's phonetics and meanings in a carousel format.
    - Arrow buttons allow cycling through multiple meanings.

7. Game Over Screen:
    - The `endGame()` function creates a game over screen showing the final score and list of found words.
    - It also provides a restart button to begin a new game.

8. Restart Functionality:
    - The `restartGame()` function resets the game state, clears the board, and starts a new game.

9. Responsive Design:
    - CSS is used to create a centered, responsive layout that works well on various screen sizes.

This implementation provides a complete "Grid Words" game that is engaging, educational, and visually appealing.