### Code Plan:

1. UI:
    - Canvas is created with a 400x600 pixel game area.
    - Game container holds all elements.
    - Score display shows the current score.
    - Game over message appears when the game ends.
    - We add a restart button after the game ends.

2. Game Elements:
    - Ship: White rectangular body at the bottom.
    - Cabin: Blue rectangle on top of the ship.
    - Ocean: Blue rectangle at the very bottom for collision detection and blue background.
    - Pivot: Invisible point at the top center.
    - Suitcase: Colorful rectangle attached to the pivot.

3. Gameplay:
    - A briefcase attached to a rope swinging 60 degrees left and right.
    - User presses space to make the suitcases fall. Then spawn another suitcase attached to the rope.
    - If the suitcase falls on the ship (not on the container), player gets 1 point.
    - If the suitcase falls down, game is over.

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Throw the Suitcase: Streamlined Cruise Edition</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.18.0/matter.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #1e3799;
            font-family: Arial, sans-serif;
        }
        #game-container {
            position: relative;
            border: 5px solid #34495E;
            border-radius: 10px;
            overflow: hidden;
        }
        #score {
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 20px;
            color: #ECF0F1;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 5px 10px;
            border-radius: 5px;
        }
        #game-over {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 40px;
            color: #E74C3C;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 20px;
            border-radius: 10px;
            display: none;
        }
        #restart {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 20px;
            padding: 10px 20px;
            background-color: #2ECC71;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            display: none;
        }
        #restart:hover {
            background-color: #27AE60;
        }
    </style>
</head>
<body>
<div id="game-container">
    <div id="score">Score: 0</div>
    <div id="game-over">Game Over</div>
    <button id="restart">Restart</button>
</div>
<script>
    const Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Constraint = Matter.Constraint,
        Composite = Matter.Composite;

    const engine = Engine.create();
    const world = engine.world;

    const render = Render.create({
        element: document.getElementById('game-container'),
        engine: engine,
        options: {
            width: 400,
            height: 600,
            wireframes: false,
            background: '#4a69bd'
        }
    });

    // Ship dimensions
    const shipWidth = 240;
    const shipHeight = 80;
    const shipY = 520;

    // Create ship body
    const ship = Bodies.rectangle(200, shipY, shipWidth, shipHeight, {
        isStatic: true,
        friction: 0.1,
        render: {
            fillStyle: '#ffffff',
            strokeStyle: '#2c3e50',
            lineWidth: 3
        }
    });

    // Create ship cabin
    const cabin = Bodies.rectangle(200, shipY - shipHeight / 2 - 20, 120, 40, {
        isStatic: true,
        render: {
            fillStyle: '#3498db',
            strokeStyle: '#2c3e50',
            lineWidth: 2
        }
    });

    // Create water
    const water = Bodies.rectangle(200, 610, 400, 20, {
        isStatic: true,
        isSensor: true,
        render: {
            fillStyle: '#0a3d62',
            opacity: 0.8
        }
    });

    World.add(world, [ship, cabin, water]);

    let score = 0;
    let currentSuitcase;
    let pivot;
    let constraint;
    let gameOver = false;
    let swingDirection = 1;
    let currentAngle = 0;

    const suitcaseColors = ['#1ABC9C', '#9B59B6', '#F1C40F', '#E74C3C', '#3498DB'];

    function createPivot() {
        pivot = Bodies.circle(200, 50, 10, {
            isStatic: true,
            render: { fillStyle: '#7F8C8D' }
        });
        World.add(world, pivot);
    }

    function createSuitcase() {
        const suitcase = Bodies.rectangle(200, 150, 40, 30, {
            density: 0.005,
            restitution: 0.2,
            friction: 0.05,
            render: {
                fillStyle: suitcaseColors[Math.floor(Math.random() * suitcaseColors.length)],
                strokeStyle: '#2C3E50',
                lineWidth: 2
            }
        });
        currentSuitcase = suitcase;
        World.add(world, suitcase);

        constraint = Constraint.create({
            pointA: { x: 200, y: 50 },
            bodyB: suitcase,
            length: 100,
            stiffness: 0.2,
            render: {
                visible: true,
                lineWidth: 2,
                strokeStyle: '#7F8C8D'
            }
        });
        World.add(world, constraint);
    }

    function releaseSuitcase() {
        if (currentSuitcase && constraint) {
            World.remove(world, constraint);
            Body.applyForce(currentSuitcase, currentSuitcase.position, { x: 0, y: 0.03 });
            constraint = null;
            setTimeout(() => {
                if (!gameOver) {
                    createSuitcase();
                }
            }, 1500);
        }
    }

    function updateScore() {
        score++;
        document.getElementById('score').textContent = `Score: ${score}`;
    }

    function checkGameOver() {
        const bodies = Composite.allBodies(world);
        for (let body of bodies) {
            if (body !== ship && body !== cabin && body !== water && body !== pivot) {
                if (body.position.y > water.position.y - 10) {
                    gameOver = true;
                    document.getElementById('game-over').style.display = 'block';
                    document.getElementById('restart').style.display = 'block';
                    return;
                }
            }
        }
    }

    function restartGame() {
        Composite.clear(world, false);
        World.add(world, [ship, cabin, water]);
        score = 0;
        document.getElementById('score').textContent = 'Score: 0';
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('restart').style.display = 'none';
        gameOver = false;
        createPivot();
        createSuitcase();
    }

    function moveShip() {
        const time = engine.timing.timestamp;
        const shipMovement = Math.sin(time * 0.002) * 20;
        Body.setPosition(ship, {
            x: 200 + shipMovement,
            y: shipY + Math.sin(time * 0.004) * 3
        });
        Body.setPosition(cabin, {
            x: 200 + shipMovement,
            y: shipY - shipHeight / 2 - 20 + Math.sin(time * 0.004) * 3
        });
    }

    function swingSuitcase() {
        if (currentSuitcase && constraint) {
            currentAngle += swingDirection * 0.05;
            if (currentAngle > Math.PI / 3 || currentAngle < -Math.PI / 3) {
                swingDirection *= -1;
            }
            const newX = 200 + Math.sin(currentAngle) * 100;
            const newY = 50 + Math.cos(currentAngle) * 100;
            Body.setPosition(currentSuitcase, { x: newX, y: newY });
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            releaseSuitcase();
        }
    });

    document.getElementById('restart').addEventListener('click', restartGame);

    Engine.run(engine);
    Render.run(render);

    createPivot();
    createSuitcase();

    Matter.Events.on(engine, 'beforeUpdate', () => {
        moveShip();
        swingSuitcase();
    });

    Matter.Events.on(engine, 'collisionStart', (event) => {
        const pairs = event.pairs;
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if (pair.bodyA === ship || pair.bodyB === ship) {
                updateScore();
            }
        }
    });

    setInterval(checkGameOver, 100);
</script>
</body>
</html>
```

### Explanation:

The game uses MatterJS engine to render game objects and physics to the world. Here are explanations of the functions used:

1. Gameplay:
    - `swingSuitcase()`: Moves the suitcase in a pendulum motion.
    - `releaseSuitcase()`: Detaches the suitcase when spacebar is pressed.
    - `moveShip()`: Adds slight left-right and up-down movement to the ship.

2. Game Logic:
    - `updateScore()`: Increments score when suitcase lands on ship.
    - `checkGameOver()`: Ends game if suitcase touches water.
    - `restartGame()`: Resets the game state for a new round.

The game uses MatterJS for physics simulation effectively to create an engaging and enraging experience for the players.