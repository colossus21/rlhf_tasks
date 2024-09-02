### Code Plan:

1. **Setup MatterJS**:
    - Import MatterJS via CDN.
    - Set the background to black and the canvas size to 800x600 pixels.
    - Disable gravity since it's a top-down game.

2. **Create the Soccer Game**:
    - Add walls to the field to prevent the ball and players from going off-screen.
    - Add goal posts on both sides at the top and bottom of the screen.
    - Add two players as square bodies.
    - Player 1 should be able to move using WASD and Player 2 using arrow keys.
    - Add a ball as a circular body in the center.

6. **Scoring and Win Condition**:
    - Detect when the ball collides with a goal post and update the score for the respective player.
    - Display a win message when a player reaches 3 goals and resets the game.

### Implementation:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Top-Down Soccer Game</title>
    <style>
        body {
            margin: 0;
            background-color: black;
            overflow: hidden;
        }
        canvas {
            display: block;
            margin: auto;
        }
    </style>
</head>
<body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.17.1/matter.min.js"></script>
<script>
    // Module aliases
    const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

    // Create engine
    const engine = Engine.create();
    const world = engine.world;

    // Disable gravity
    engine.gravity.y = 0;

    // Create renderer with black background
    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false,
            background: 'black'
        }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Create soccer field boundaries
    const topWall = Bodies.rectangle(400, 0, 800, 20, { isStatic: true });
    const bottomWall = Bodies.rectangle(400, 600, 800, 20, { isStatic: true });
    const leftWall = Bodies.rectangle(0, 300, 20, 600, { isStatic: true });
    const rightWall = Bodies.rectangle(800, 300, 20, 600, { isStatic: true });

    World.add(world, [topWall, bottomWall, leftWall, rightWall]);

    // Create goal posts
    const goalWidth = 200;
    const topGoal = Bodies.rectangle(400, 30, goalWidth, 10, { isStatic: true, render: { fillStyle: 'white' } });
    const bottomGoal = Bodies.rectangle(400, 570, goalWidth, 10, { isStatic: true, render: { fillStyle: 'white' } });

    World.add(world, [topGoal, bottomGoal]);

    // Create players
    const player1 = Bodies.rectangle(400, 100, 40, 40, { render: { fillStyle: 'yellow' } });
    const player2 = Bodies.rectangle(400, 500, 40, 40, { render: { fillStyle: 'lightcoral' } });

    World.add(world, [player1, player2]);

    // Create the ball with high bounciness
    const ball = Bodies.circle(400, 300, 20, { 
        render: { fillStyle: 'white' }, 
        restitution: 1.2  // Increased restitution for more bounciness
    });
    World.add(world, ball);

    // Initialize scores
    let player1Score = 0;
    let player2Score = 0;

    // Movement speed
    const playerSpeed = 3.5;

    // Handle player movement with keyboard
    document.addEventListener('keydown', (event) => {
        const { x, y } = player1.velocity;

        // Player 1 (WASD keys)
        if (event.key === 'w') {
            Body.setVelocity(player1, { x, y: -playerSpeed });
        } else if (event.key === 's') {
            Body.setVelocity(player1, { x, y: playerSpeed });
        } else if (event.key === 'a') {
            Body.setVelocity(player1, { x: -playerSpeed, y });
        } else if (event.key === 'd') {
            Body.setVelocity(player1, { x: playerSpeed, y });
        }

        // Player 2 (Arrow keys)
        if (event.key === 'ArrowUp') {
            Body.setVelocity(player2, { x, y: -playerSpeed });
        } else if (event.key === 'ArrowDown') {
            Body.setVelocity(player2, { x, y: playerSpeed });
        } else if (event.key === 'ArrowLeft') {
            Body.setVelocity(player2, { x: -playerSpeed, y });
        } else if (event.key === 'ArrowRight') {
            Body.setVelocity(player2, { x: playerSpeed, y });
        }
    });

    // Detect goal events
    Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach(pair => {
            if (pair.bodyA === ball || pair.bodyB === ball) {
                if (pair.bodyA === bottomGoal || pair.bodyB === bottomGoal) {
                    player1Score++;
                    resetPositions();
                } else if (pair.bodyA === topGoal || pair.bodyB === topGoal) {
                    player2Score++;
                    resetPositions();
                }

                if (player1Score === 3) {
                    alert('Player 1 wins!');
                    resetGame();
                } else if (player2Score === 3) {
                    alert('Player 2 wins!');
                    resetGame();
                }
            }
        });
    });

    // Reset positions after a goal
    function resetPositions() {
        Body.setPosition(player1, { x: 400, y: 100 });
        Body.setPosition(player2, { x: 400, y: 500 });
        Body.setPosition(ball, { x: 400, y: 300 });
        Body.setVelocity(player1, { x: 0, y: 0 });
        Body.setVelocity(player2, { x: 0, y: 0 });
        Body.setVelocity(ball, { x: 0, y: 0 });
    }

    // Reset the entire game
    function resetGame() {
        player1Score = 0;
        player2Score = 0;
        resetPositions();
    }
</script>
</body>
</html>
```

We have used Matter.js to set up the physics engine, render the game, and define the game objects (players, ball, boundaries).
Players are controlled using WASD and arrow keys. Scoring is detected through collision events between the ball and the goal posts. The game resets after one player scores 3 goals. 

This implementation provides a simple top-down soccer game with two players competing to score goals.