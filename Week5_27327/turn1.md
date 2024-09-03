### Code Plan

1. **Board Setup:**
    - The board should be a 12x12 grid with square cells. Each cell can contain a player, ghost, chalice or an empty cell.
    - The player starts at the top-left and the ghost in the bottom-right corner.
    - The Player would be a triangle and the ghost would be a square.

2. **Randomness:**
    - Three chalices should be randomly placed on the board.
    - Walls should also be randomly placed across the board. The player or the ghost cannot pass through the walls.

3. **Game Rules:**
    - Each player rolls the dice at the start of their turn, which determines the maximum number of cells they can move.
    - After the dice is rolled, the available moves are highlighted on the board.
    - The player or ghost can then click on a highlighted cell to move their character.
    - The player wins the game collecting all three chalices, and the ghost wins the game by chasing the player.

#### Implementation:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ghost and Chalices</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Side-Scroller Game</title>
        <style>
        body {
           margin: 0;
           display: flex;
           justify-content: center;
           align-items: center;
           height: 100vh;
           background-color: #282c34;
           color: white;
           font-family: Arial, sans-serif;
        }
           #game-container {
              position: relative;
              overflow: hidden;
              width: 800px;
              height: 400px;
              background-color: #1e1e1e;
              border: 2px solid #fff;
           }
           #timer {
              position: absolute;
              top: 10px;
              width: 100%;
              text-align: center;
              font-size: 24px;
           }
           #exhaustion-bar-container {
              display: none;
              position: absolute;
              top: 40px;
              width: 50px;
              height: 5px;
              left: calc(50% - 25px);
              background-color: red;
           }
           #distance-remaining {
              position: absolute;
              top: 10px;
              right: 10px;
              font-size: 18px;
           }
           #message {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: 32px;
              text-align: center;
           }
           #restart {
              display: none;
              position: absolute;
              top: 60%;
              left: 50%;
              transform: translate(-50%, -50%);
              padding: 10px 20px;
              font-size: 18px;
              background-color: #007bff;
              color: white;
              border: none;
              cursor: pointer;
           }
           .exhaustion-bar {
              height: 100%;
              background-color: green;
           }
    </style>
</head>
<body>
<div id="game-container">
   <div id="timer">60</div>
   <div id="exhaustion-bar-container">
      <div id="exhaustion-bar" class="exhaustion-bar"></div>
   </div>
   <div id="distance-remaining">Distance Remaining: 10000</div>
   <div id="message"></div>
   <button id="restart">Restart</button>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.17.1/matter.min.js"></script>
<script>
   const { Engine, Render, Runner, World, Bodies, Body, Events, Composite } = Matter;

   const gameContainer = document.getElementById('game-container');
   const engine = Engine.create();
   const world = engine.world;

   const width = 800;
   const height = 400;
   const groundHeight = 20;
   let isMounted = false;
   let mountedSquare = null;
   let timer = 60;
   let gameActive = true;
   const playerSpeed = 5;
   let exhaustionInterval;
   const finishLineX = 10000;

   const render = Render.create({
      element: gameContainer,
      engine: engine,
      options: {
         width: width,
         height: height,
         wireframes: false,
         background: '#1e1e1e'
      }
   });

   const ground = Bodies.rectangle(width * 10, height - groundHeight / 2, width * 20, groundHeight, { isStatic: true });
   World.add(world, ground);

   // Create the player as a downward-facing triangle
   const player = Bodies.polygon(100, height - 60, 3, 20, {
      render: { fillStyle: 'yellow' },
      friction: 0.001,
      collisionFilter: {
         group: -2 // Prevents collision with unmounted squares
      },
      inertia: Infinity, // Prevents rotation
      angle: Math.PI / 2 // Rotate triangle 180 degrees
   });
   World.add(world, player);

   const squares = [];
   let previousX = 200;
   for (let i = 0; i < 10; i++) {
      const squareWidth = 50;
      const squareHeight = 20;
      const randomDistance = 500 + Math.random() * 800; // Random distance between squares
      const squareX = previousX + randomDistance;
      previousX = squareX;
      const squareY = height - groundHeight - squareHeight / 2;
      const speed = 2 + Math.random() * 4;
      const square = Bodies.rectangle(squareX, squareY, squareWidth, squareHeight, {
         render: { fillStyle: getRandomColor() },
         friction: 0,
         frictionAir: 0,
         isStatic: false, // Square is dynamic and can move
         speed: speed,
         collisionFilter: {
            group: -2 // Prevents collision with mounted player and other squares
         },
         inertia: Infinity // Prevents rotation
      });
      squares.push(square);
      World.add(world, square);
   }

   function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
         color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
   }

   let timerInterval = setInterval(() => {
      if (gameActive) {
         timer--;
         document.getElementById('timer').innerText = timer;
         if (timer <= 0) {
            endGame('You Lose!');
         }
      }
   }, 1000);

   function updateDistanceRemaining() {
      const distanceRemaining = Math.max(0, Math.floor(finishLineX - player.position.x));
      document.getElementById('distance-remaining').innerText = `Distance Remaining: ${distanceRemaining}`;
   }

   function endGame(message) {
      gameActive = false;
      document.getElementById('message').innerText = message;
      document.getElementById('restart').style.display = 'block';
      clearInterval(timerInterval);
      clearInterval(exhaustionInterval);
      Events.off(engine, 'beforeUpdate');
   }

   document.getElementById('restart').addEventListener('click', () => {
      location.reload();
   });

   const finishLine = Bodies.rectangle(finishLineX, height - groundHeight / 2, 20, height, { isStatic: true, render: { fillStyle: 'red' } });
   World.add(world, finishLine);

   Events.on(engine, 'beforeUpdate', () => {
      if (gameActive) {
         // Move player with WASD
         let moveX = 0;
         if (isKeyPressed('KeyW') && Math.abs(player.velocity.y) < 1) {
            Body.setVelocity(player, { x: player.velocity.x, y: -10 });
         }
         if (isKeyPressed('KeyA')) {
            moveX = isMounted ? -mountedSquare.speed : -playerSpeed;
         }
         if (isKeyPressed('KeyD')) {
            moveX = isMounted ? mountedSquare.speed : playerSpeed;
         }
         Body.setVelocity(player, { x: moveX, y: player.velocity.y });

         // Check if player is on a square
         for (let i = 0; i < squares.length; i++) {
            const square = squares[i];
            if (Matter.SAT.collides(player, square).collided && !isMounted && isKeyPressed('KeyW')) {
               isMounted = true;
               mountedSquare = square;

               // Stick player to square
               Body.setVelocity(player, { x: mountedSquare.speed, y: 0 }); // Fix player's velocity when mounted
               Body.setPosition(player, { x: mountedSquare.position.x, y: mountedSquare.position.y - 35 }); // Adjust player position to sit on top

               // Change collision group to prevent collisions with unmounted horses
               player.collisionFilter.group = -1;
               mountedSquare.collisionFilter.group = -1;

               // Start exhaustion countdown and show exhaustion bar
               startExhaustionCountdown();
               document.getElementById('exhaustion-bar-container').style.display = 'block';
            }
         }

         // Move the mounted square with the player
         if (isMounted && mountedSquare) {
            Body.setVelocity(mountedSquare, { x: moveX, y: mountedSquare.velocity.y });
         }

         // Update the distance remaining
         updateDistanceRemaining();

         // Scroll the screen based on player movement
         Render.lookAt(render, {
            min: { x: player.position.x - width / 2, y: 0 },
            max: { x: player.position.x + width / 2, y: height }
         });

         // Check if player crossed the finish line
         if (Matter.SAT.collides(player, finishLine).collided) {
            endGame('You Win!');
         }
      }
   });

   function startExhaustionCountdown() {
      const exhaustionTime = 5000 + Math.random() * 3000; // Random exhaustion time between 5 to 8 seconds
      let greenWidth = 50;
      let redWidth = 0;
      const decrement = greenWidth / (exhaustionTime / 100); // Calculate the decrement per 100ms

      // Create and position the exhaustion bar
      const exhaustionBar = document.getElementById('exhaustion-bar');
      exhaustionBar.style.width = `${greenWidth}px`;

      exhaustionInterval = setInterval(() => {
         if (!isMounted) {
            clearInterval(exhaustionInterval);
            document.getElementById('exhaustion-bar-container').style.display = 'none';
            return;
         }

         greenWidth -= decrement;
         redWidth += decrement;
         exhaustionBar.style.width = `${greenWidth}px`;
         exhaustionBar.style.background = `linear-gradient(to right, green ${greenWidth}%, red ${redWidth}%)`;

         // Exhaustion reached
         if (greenWidth <= 0) {
            clearInterval(exhaustionInterval);
            dismountPlayer();
         }
      }, 100);
   }

   function dismountPlayer() {
      isMounted = false;
      Body.setVelocity(player, { x: playerSpeed, y: player.velocity.y });
      if (mountedSquare) {
         mountedSquare.collisionFilter.group = -2; // Reset collision group
         mountedSquare = null;
      }
      player.collisionFilter.group = -2; // Reset collision group
      document.getElementById('exhaustion-bar-container').style.display = 'none';
   }

   function isKeyPressed(key) {
      return !!keys[key];
   }

   const keys = {};
   window.addEventListener('keydown', (e) => {
      keys[e.code] = true;
   });

   window.addEventListener('keyup', (e) => {
      keys[e.code] = false;
   });

   Render.run(render);
   const runner = Runner.create();
   Runner.run(runner, engine);
</script>
</body>
</html>

background-color: #2c3e50;
            font-family: Arial, sans-serif;
            color: white;
        }

        .game-container {
            display: grid;
            grid-template-columns: repeat(12, 50px);
            grid-template-rows: repeat(12, 50px);
            gap: 2px;
            background-color: #34495e;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        }

        .cell {
            width: 50px;
            height: 50px;
            background-color: #2c3e50;
            border: 1px solid #ecf0f1;
            position: relative;
            transition: background-color 0.3s, transform 0.3s;
            cursor: pointer;
        }

        .highlight {
            background-color: #3498db;
        }

        .player, .ghost, .chalice {
            position: absolute;
            width: 100%;
            height: 100%;
        }

        .player {
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
            background-color: #f39c12;
        }

        .ghost {
            background-color: #e74c3c;
        }

        .chalice {
            background-color: #f1c40f;
            clip-path: polygon(50% 0%, 35% 25%, 0% 25%, 20% 60%, 10% 100%, 50% 85%, 90% 100%, 80% 60%, 100% 25%, 65% 25%);
        }

        .wall {
            background-color: #7f8c8d;
        }

        .win-message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 10;
            display: none;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        }

        .win-message.active {
            display: block;
        }

        .btn-restart {
            margin-top: 10px;
            padding: 10px;
            border: none;
            background-color: #e67e22;
            color: white;
            cursor: pointer;
            font-size: 16px;
            border-radius: 5px;
        }

        .btn-restart:hover {
            background-color: #d35400;
        }

        /* Dice Styles */
        .dice-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
        }

        .dice {
            width: 60px;
            height: 60px;
            background-color: #ecf0f1;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            position: relative;
            margin: 0 10px;
        }

        .dice .dot {
            width: 12px;
            height: 12px;
            background-color: black;
            border-radius: 50%;
            position: absolute;
        }

        /* Dot positions for each dice face */
        .face-1 .dot:nth-child(1) { top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .face-2 .dot:nth-child(1) { top: 25%; left: 25%; }
        .face-2 .dot:nth-child(2) { bottom: 25%; right: 25%; }
        .face-3 .dot:nth-child(1) { top: 25%; left: 25%; }
        .face-3 .dot:nth-child(2) { top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .face-3 .dot:nth-child(3) { bottom: 25%; right: 25%; }
        .face-4 .dot:nth-child(1) { top: 25%; left: 25%; }
        .face-4 .dot:nth-child(2) { top: 25%; right: 25%; }
        .face-4 .dot:nth-child(3) { bottom: 25%; left: 25%; }
        .face-4 .dot:nth-child(4) { bottom: 25%; right: 25%; }
        .face-5 .dot:nth-child(1) { top: 25%; left: 25%; }
        .face-5 .dot:nth-child(2) { top: 25%; right: 25%; }
        .face-5 .dot:nth-child(3) { top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .face-5 .dot:nth-child(4) { bottom: 25%; left: 25%; }
        .face-5 .dot:nth-child(5) { bottom: 25%; right: 25%; }
        .face-6 .dot:nth-child(1) { top: 25%; left: 25%; }
        .face-6 .dot:nth-child(2) { top: 25%; right: 25%; }
        .face-6 .dot:nth-child(3) { top: 50%; left: 25%; }
        .face-6 .dot:nth-child(4) { top: 50%; right: 25%; }
        .face-6 .dot:nth-child(5) { bottom: 25%; left: 25%; }
        .face-6 .dot:nth-child(6) { bottom: 25%; right: 25%; }

        .roll-button {
            margin-left: 20px;
            padding: 10px 20px;
            background-color: #e67e22;
            border: none;
            cursor: pointer;
            font-size: 16px;
            border-radius: 5px;
        }

        .roll-button:hover {
            background-color: #d35400;
        }

    </style>
</head>
<body>
<div class="game-container" id="game-container"></div>

<div class="dice-container">
    <div class="dice" id="player-dice">
        <!-- Dice dots will be inserted here -->
    </div>
    <button class="roll-button" id="roll-button">Roll Dice</button>
    <div class="dice" id="ghost-dice">
        <!-- Dice dots will be inserted here -->
    </div>
</div>

<div class="win-message" id="win-message">
    <div id="win-text"></div>
    <button class="btn-restart" onclick="startGame()">Restart</button>
</div>

<script>
    const BOARD_SIZE = 12;
    const playerStartPosition = { x: 0, y: 0 };
    const ghostStartPosition = { x: BOARD_SIZE - 1, y: BOARD_SIZE - 1 };
    let playerPosition = { ...playerStartPosition };
    let ghostPosition = { ...ghostStartPosition };
    let chalices = [];
    let walls = [];
    let playerRoll = 0;
    let ghostRoll = 0;
    let currentPlayer = 'player'; // 'player' or 'ghost'
    let collectedChalices = 0;

    function startGame() {
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = '';
        playerPosition = { ...playerStartPosition };
        ghostPosition = { ...ghostStartPosition };
        chalices = [];
        walls = [];
        playerRoll = 0;
        ghostRoll = 0;
        currentPlayer = 'player';
        collectedChalices = 0;

        document.getElementById('win-message').classList.remove('active');

        generateBoard();
        placeChalices();
        placeWalls();
        updateBoard();
        clearHighlight();
    }

    function generateBoard() {
        const gameContainer = document.getElementById('game-container');
        for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.addEventListener('click', () => onCellClick(x, y));
                gameContainer.appendChild(cell);
            }
        }
    }

    function placeChalices() {
        while (chalices.length < 3) {
            const x = Math.floor(Math.random() * BOARD_SIZE);
            const y = Math.floor(Math.random() * BOARD_SIZE);
            if (isCellEmpty(x, y)) {
                chalices.push({ x, y });
            }
        }
    }

    function placeWalls() {
        const numberOfWalls = Math.floor(Math.random() * 10) + 5; // 5 to 15 walls
        while (walls.length < numberOfWalls) {
            const x = Math.floor(Math.random() * BOARD_SIZE);
            const y = Math.floor(Math.random() * BOARD_SIZE);
            if (isCellEmpty(x, y) && !isChalicePosition(x, y)) {
                walls.push({ x, y });
            }
        }
    }

    function isCellEmpty(x, y) {
        return !(x === playerPosition.x && y === playerPosition.y) &&
            !(x === ghostPosition.x && y === ghostPosition.y) &&
            !isChalicePosition(x, y) &&
            !isWallPosition(x, y);
    }

    function isChalicePosition(x, y) {
        return chalices.some(chalice => chalice.x === x && chalice.y === y);
    }

    function isWallPosition(x, y) {
        return walls.some(wall => wall.x === x && wall.y === y);
    }

    function onCellClick(x, y) {
        if (currentPlayer === 'player' && isValidMove(playerPosition, { x, y }, playerRoll)) {
            movePlayer(x, y);
            if (isChalicePosition(x, y)) {
                collectChalice(x, y);
            }
            checkWinCondition();
            currentPlayer = 'ghost';
        } else if (currentPlayer === 'ghost' && isValidMove(ghostPosition, { x, y }, ghostRoll)) {
            moveGhost(x, y);
            checkWinCondition();
            currentPlayer = 'player';
        }
        updateBoard();
        clearHighlight();
    }

    function rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function showDiceRoll(diceId, roll) {
        const dice = document.getElementById(diceId);
        dice.className = 'dice face-' + roll;
        dice.innerHTML = '';

        for (let i = 0; i < roll; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dice.appendChild(dot);
        }
    }

    function rollBothDice() {
        if (currentPlayer === 'player') {
            playerRoll = rollDice();
            showDiceRoll('player-dice', playerRoll);
            highlightPossibleMoves(playerPosition, playerRoll);
        } else {
            ghostRoll = rollDice();
            showDiceRoll('ghost-dice', ghostRoll);
            highlightPossibleMoves(ghostPosition, ghostRoll);
        }
    }

    function highlightPossibleMoves(position, maxDistance) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const x = parseInt(cell.dataset.x, 10);
            const y = parseInt(cell.dataset.y, 10);
            cell.classList.remove('highlight');

            if (isValidMove(position, { x, y }, maxDistance)) {
                cell.classList.add('highlight');
            }
        });
    }

    function isValidMove(from, to, maxDistance) {
        const distance = calculateDistance(from, to);
        return distance <= maxDistance && !isWallPosition(to.x, to.y);
    }

    function calculateDistance(from, to) {
        // Breadth-first search to consider walls
        const queue = [[from.x, from.y, 0]];
        const visited = new Set();
        visited.add(`${from.x},${from.y}`);

        while (queue.length > 0) {
            const [x, y, dist] = queue.shift();

            if (x === to.x && y === to.y) {
                return dist;
            }

            const directions = [
                [x + 1, y], [x - 1, y],
                [x, y + 1], [x, y - 1]
            ];

            for (const [nx, ny] of directions) {
                if (nx >= 0 && ny >= 0 && nx < BOARD_SIZE && ny < BOARD_SIZE && !isWallPosition(nx, ny) && !visited.has(`${nx},${ny}`)) {
                    visited.add(`${nx},${ny}`);
                    queue.push([nx, ny, dist + 1]);
                }
            }
        }

        return Infinity; // No valid path
    }

    function movePlayer(x, y) {
        playerPosition = { x, y };
        updateBoard();
    }

    function moveGhost(x, y) {
        ghostPosition = { x, y };
        updateBoard();
    }

    function clearHighlight() {
        const cells = document.querySelectorAll('.cell.highlight');
        cells.forEach(cell => cell.classList.remove('highlight'));
    }

    function collectChalice(x, y) {
        chalices = chalices.filter(chalice => !(chalice.x === x && chalice.y === y));
        collectedChalices++;
    }

    function checkWinCondition() {
        if (playerPosition.x === ghostPosition.x && playerPosition.y === ghostPosition.y) {
            showWinMessage("Ghost wins!");
        } else if (collectedChalices === 3) {
            showWinMessage("Player wins!");
        }
    }

    function showWinMessage(message) {
        const winMessage = document.getElementById('win-message');
        const winText = document.getElementById('win-text');
        winText.textContent = message;
        winMessage.classList.add('active');
    }

    function updateBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const x = parseInt(cell.dataset.x, 10);
            const y = parseInt(cell.dataset.y, 10);
            cell.innerHTML = '';
            if (x === playerPosition.x && y === playerPosition.y) {
                const playerElement = document.createElement('div');
                playerElement.classList.add('player');
                cell.appendChild(playerElement);
            } else if (x === ghostPosition.x && y === ghostPosition.y) {
                const ghostElement = document.createElement('div');
                ghostElement.classList.add('ghost');
                cell.appendChild(ghostElement);
            } else if (isChalicePosition(x, y)) {
                const chaliceElement = document.createElement('div');
                chaliceElement.classList.add('chalice');
                cell.appendChild(chaliceElement);
            } else if (isWallPosition(x, y)) {
                cell.classList.add('wall');
            } else {
                cell.classList.remove('wall');
            }
        });
    }

    document.getElementById('roll-button').addEventListener('click', rollBothDice);

    startGame();
</script>
</body>
</html>
```

### Explanation:

1. **UI:**
    - The game board is created using a 12x12 CSS Grid. Each cell is a `div` element, which can hold different elements like the player, ghost, chalices, or walls.
    - Chalices are star-shaped, the player is a yellow triangle and the ghost a red square. Shapes are created using '`clip-path` property of CSS.
    - The background is made blueish for a coherent theme with other elements.
    - 5-15 walls are generated on the grid randomly ensuring they do not overlap with the starting positions of the player, ghost, or chalices.
    - The colors of the cells are changed to highlight available moves for the player and the ghost.
    - A restart button is provided to reset the game after either the player wins or the ghost.

2. **Gameplay:**
    - The game is turn-based, with each player rolling the dice to determine the number of moves. User can click on the cell directly to move.
    - The chalice is removed from the grid when the player lands on it. Player wins the game collecting all chalices.
    - The ghost wins if it lands on the same cell as the player.

The game has both turn-based strategies with visually appealing elements which make it a very fun and engaging 2-player board game.