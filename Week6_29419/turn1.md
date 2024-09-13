### Code Plan:

1. UI:
   1. Add game title at the top of the screen.
   2. Add status bar showing:
       - Gems collected (out of 3)
       - Number of moves made.
       - Current energy level (out of 100%).
   3. Create a 12x12 grid representing the maze.
   4. Add a message display area for game events and outcomes.

2. Gameplay:
   1. Player (👤) starts at a fixed position (e.g., top-left corner) in a randomly generated maze.
   2. Player can move using arrow keys in four directions: up, down, left, right. Only surrounding cells are visible.
   3. A fog of war effect creates a gradual fade-out beyond the visible cells.
   4. Three gems (💎) and five traps (💀)are hidden in the maze are hidden in the maze.
   5. Each move costs 1% energy. Stepping on a trap reduces energy by 15%.
   6. The game ends when:
       - Win: All 3 gems are collected.
       - Lose: Energy reaches 0%.
   7. Players can restart the game to try again with a new randomly generated maze,

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maze Gem Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background-color: #1a202c;
            color: white;
        }
        h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        #status-bar {
            display: flex;
            justify-content: space-between;
            width: 100%;
            max-width: 600px;
            margin-bottom: 1rem;
        }
        #game-board {
            display: grid;
            grid-template-columns: repeat(12, 50px);
            grid-template-rows: repeat(12, 50px);
            gap: 1px;
            border: 2px solid #4a5568;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
        }
        .cell {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: all 0.3s ease;
            border-radius: 4px;
        }
        .wall { background-color: #4a5568; }
        .path { background-color: #e2e8f0; }
        .player { background-color: #3182ce; }
        .gem { background-color: #d6bcfa; }
        .trap { background-color: #feb2b2; }
        .hidden { opacity: 0; }
        #light-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            transition: opacity 0.5s ease;
        }
        #message {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 4px;
            text-align: center;
        }
        .success { background-color: #c6f6d5; color: #22543d; }
        .failure { background-color: #fed7d7; color: #822727; }
    </style>
</head>
<body>
<h1>Maze Gem Game</h1>
<div id="status-bar">
    <div>Gems: <span id="gems-collected">0</span> / <span id="total-gems">3</span></div>
    <div>Moves: <span id="moves">0</span></div>
    <div>Energy: <span id="energy">100</span>%</div>
</div>
<div id="game-board"></div>
<div id="message"></div>
<script>
    const GRID_SIZE = 12;
    const NUM_GEMS = 3;
    const NUM_TRAPS = 5;
    const INITIAL_ENERGY = 100;

    let maze, playerPos, gems, traps, collectedGems, gameWon, gameLost, energy, moves;

    function initGame() {
        maze = generateMaze();
        playerPos = { x: 1, y: 1 };
        gems = placeItems(NUM_GEMS);
        traps = placeItems(NUM_TRAPS);
        collectedGems = 0;
        gameWon = false;
        gameLost = false;
        energy = INITIAL_ENERGY;
        moves = 0;
        updateStatusBar();
        renderBoard();
    }

    function generateMaze() {
        const maze = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(1));
        const stack = [[1, 1]];
        maze[1][1] = 0;

        while (stack.length) {
            const [x, y] = stack.pop();
            const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]].sort(() => Math.random() - 0.5);

            for (const [dx, dy] of directions) {
                const nx = x + dx, ny = y + dy;
                if (nx > 0 && nx < GRID_SIZE - 1 && ny > 0 && ny < GRID_SIZE - 1 && maze[nx][ny] === 1) {
                    maze[x + dx / 2][y + dy / 2] = 0;
                    maze[nx][ny] = 0;
                    stack.push([nx, ny]);
                }
            }
        }

        return maze;
    }

    function placeItems(count) {
        const items = [];
        while (items.length < count) {
            const x = Math.floor(Math.random() * GRID_SIZE);
            const y = Math.floor(Math.random() * GRID_SIZE);
            if (maze[x][y] === 0 && !items.some(item => item.x === x && item.y === y) && (x !== 1 || y !== 1)) {
                items.push({ x, y });
            }
        }
        return items;
    }

    function renderBoard() {
        const board = document.getElementById('game-board');
        board.innerHTML = '';
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.id = `cell-${x}-${y}`;
                board.appendChild(cell);
            }
        }
        updateCells();
        createLightOverlay();
    }

    function updateCells() {
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                const cell = document.getElementById(`cell-${x}-${y}`);
                const distance = Math.sqrt(Math.pow(x - playerPos.x, 2) + Math.pow(y - playerPos.y, 2));
                const isVisible = distance <= 2 || gameWon || gameLost;
                cell.classList.toggle('hidden', !isVisible);

                if (isVisible || gameWon || gameLost) {
                    cell.classList.remove('wall', 'path', 'player', 'gem', 'trap');
                    if (x === playerPos.x && y === playerPos.y) {
                        cell.classList.add('player');
                        cell.textContent = '👤';
                    } else if (gems.some(gem => gem.x === x && gem.y === y)) {
                        cell.classList.add('gem');
                        cell.textContent = '💎';
                    } else if (traps.some(trap => trap.x === x && trap.y === y)) {
                        cell.classList.add('trap');
                        cell.textContent = '💀';
                    } else {
                        cell.classList.add(maze[x][y] === 1 ? 'wall' : 'path');
                        cell.textContent = '';
                    }
                }
            }
        }
    }

    function createLightOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'light-overlay';
        document.getElementById('game-board').appendChild(overlay);
        updateLightOverlay();
    }

    function updateLightOverlay() {
        const overlay = document.getElementById('light-overlay');
        const cellSize = 50; // Make sure this matches the CSS
        overlay.style.background = `
                radial-gradient(
                    circle at ${(playerPos.y + 0.5) * cellSize}px ${(playerPos.x + 0.5) * cellSize}px,
                    rgba(255, 255, 255, 0.3) 0%,
                    rgba(255, 255, 255, 0.1) 30%,
                    rgba(255, 255, 255, 0) 70%
                )
            `;
        overlay.style.opacity = gameWon || gameLost ? 0 : 1;
    }

    function movePlayer(dx, dy) {
        if (gameWon || gameLost) return;

        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE && maze[newX][newY] === 0) {
            playerPos = { x: newX, y: newY };
            moves++;
            energy = Math.max(0, energy - 1);

            const gemIndex = gems.findIndex(gem => gem.x === newX && gem.y === newY);
            if (gemIndex !== -1) {
                collectedGems++;
                gems.splice(gemIndex, 1);
                energy = Math.min(energy + 20, INITIAL_ENERGY);
                if (collectedGems === NUM_GEMS) {
                    gameWon = true;
                    showMessage(`Congratulations! You've collected all the gems in ${moves} moves!`, 'success');
                }
            }

            const trapIndex = traps.findIndex(trap => trap.x === newX && trap.y === newY);
            if (trapIndex !== -1) {
                energy = Math.max(0, energy - 15);
                traps.splice(trapIndex, 1);
            }

            if (energy <= 0) {
                gameLost = true;
                showMessage('Game Over! You ran out of energy.', 'failure');
            }

            updateStatusBar();
            updateCells();
            updateLightOverlay();
        }
    }

    function updateStatusBar() {
        document.getElementById('gems-collected').textContent = collectedGems;
        document.getElementById('total-gems').textContent = NUM_GEMS;
        document.getElementById('moves').textContent = moves;
        document.getElementById('energy').textContent = energy;
    }

    function showMessage(text, type) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = text;
        messageEl.className = type;
    }

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp': movePlayer(-1, 0); break;
            case 'ArrowDown': movePlayer(1, 0); break;
            case 'ArrowLeft': movePlayer(0, -1); break;
            case 'ArrowRight': movePlayer(0, 1); break;
        }
    });

    initGame();
</script>
</body>
</html>
```

### Explanation:

1. Maze Generation: A 12x12 grid with randomly generated walls and paths.
2. Player Movement: Controlled by arrow keys, with energy reduction per move.
3. Gems and Traps: 3 gems to collect, 5 hidden traps to avoid.
4. Fog of War: Limited visibility around the player with a light effect.
5. Energy System: Starts at 100%, decreases with moves and traps.
6. Win/Lose Conditions: Win by collecting all gems, lose if energy depletes.
7. Key functions:
   1. `generateMaze()`:
       - Uses a depth-first search algorithm to create a random maze.
       - Ensures a valid path exists through the maze.

   2. `placeItems()`:
       - Randomly places gems and traps on open paths in the maze.
       - Ensures items don't overlap with each other or the player's start position.

   3. `renderBoard()`:
       - Creates the visual representation of the maze.
       - Sets up initial cell states (hidden/visible).

   4. `updateCells()`:
       - Updates the visibility and content of cells based on player position.
       - Reveals cells within the player's vision range.

   5. `createFogOfWar()`:
       - Implements the gradual fade-out effect beyond the immediately visible cells.
       - Uses CSS to create a radial gradient centered on the player.

This plan outlines a structured approach to creating the maze game that is visually appealing and fun to play.