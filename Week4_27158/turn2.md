Here's how you can integrate sound effects and power-ups into the game:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Breakout Evasion</title>
    <style>
        body, html {
            height: 100%;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f0f0f0;
        }
        canvas {
            border: 1px solid black;
        }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.18.0/matter.min.js"></script>
</head>
<body>
<script>
    // Initialize Matter.js engine and elements
    let Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Events = Matter.Events;

    let engine, balls = [], bricks = [], paddle, boundaries = [], powerups = [];
    let gameRunning = true, gameWon = false;
    const initialVelocity = { x: 5, y: 5 };
    let powerupActive = false, powerupTimer = null;
    let gameOverSoundPlayed = false;
    let totalBricks = 50;
    let bricksDestroyed = 0;
    let nextBallThreshold = 0.2;
    let paddleColor = '#FFFFFF';

    function setup() {
        createCanvas(600, 400);
        engine = Engine.create();
        engine.world.gravity.y = 0.1; 

        setupBoundaries();
        setupPaddle();
        setupBricks();
        setupInitialBall();

        Events.on(engine, 'collisionStart', handleCollisions);
    }

    function draw() {
        background(220);
        if (gameRunning && !gameWon) {
            Engine.update(engine);
            maintainBallVelocity();
            displayAll();
            checkWinCondition();
            spawnNewBallIfNeeded();
        } else if (gameWon) {
            if (!gameOverSoundPlayed) {
                playSound('win.wav');
                gameOverSoundPlayed = true;
            }
            displayWin();
        } else {
            if (!gameOverSoundPlayed) {
                playSound('gameOver.wav');
                gameOverSoundPlayed = true;
            }
            displayGameOver();
        }
    }

    function maintainBallVelocity() {
        balls.forEach(ball => {
            let speed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);
            let desiredSpeed = Math.sqrt(initialVelocity.x ** 2 + initialVelocity.y ** 2);
            let minSpeedY = 2;

            if (speed < desiredSpeed) {
                let angle = Math.atan2(ball.velocity.y, ball.velocity.x);
                Body.setVelocity(ball, { x: Math.cos(angle) * desiredSpeed, y: Math.sin(angle) * desiredSpeed });
            }

            if (ball.velocity.y > -minSpeedY && ball.velocity.y < minSpeedY) {
                Body.setVelocity(ball, { x: ball.velocity.x, y: ball.velocity.y < 0 ? -minSpeedY : minSpeedY });
            }
        });
    }

    function setupBoundaries() {
        boundaries.push(Bodies.rectangle(300, 0, 600, 10, { isStatic: true }));
        boundaries.push(Bodies.rectangle(300, 400, 600, 10, { isStatic: true, label: 'floor' }));
        boundaries.push(Bodies.rectangle(0, 200, 10, 400, { isStatic: true }));
        boundaries.push(Bodies.rectangle(600, 200, 10, 400, { isStatic: true }));
        World.add(engine.world, boundaries);
    }

    function setupPaddle() {
        paddle = Bodies.rectangle(300, 380, 100, 10, { isStatic: true });
        World.add(engine.world, paddle);
    }

    function setupBricks() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0;  j < 10; j++) {
                let brick = Bodies.rectangle(30 + j * 55, 30 + i * 25, 50, 20, { isStatic: true });
                bricks.push(brick);
            }
        }
        World.add(engine.world, bricks);
    }

    function setupInitialBall() {
        let ball = Bodies.circle(300, 200, 10, { restitution: 1.05 });
        Body.setVelocity(ball, { x: 5, y: 5 });
        balls.push(ball);
        World.add(engine.world, ball);
    }

    function displayAll() {
        fill(0);
        stroke(0);
        balls.forEach(ball => {
            ellipse(ball.position.x, ball.position.y, 20);
        });
        bricks.forEach(brick => {
            rect(brick.position.x - 25, brick.position.y - 10, 50, 20);
        });
        fill(paddleColor);
        rect(paddle.position.x - 50, paddle.position.y - 5, 100, 10);
        powerups.forEach(powerup => {
            if (powerup.visible) {
                if (powerup.label === 'invincible') {
                    fill(128);
                } else {
                    fill(255, 255, 0);
                }
                ellipse(powerup.position.x, powerup.position.y, 15);
            }
        });
    }

    function displayGameOver() {
        textSize(32);
        textAlign(CENTER);
        fill(255, 0, 0);
        text("Game Over", width / 2, height / 2);
    }

    function displayWin() {
        textSize(32);
        textAlign(CENTER);
        fill(0, 255, 0);
        text("You Win!", width / 2, height / 2);
    }

    function handleCollisions(event) {
        event.pairs.forEach(pair => {
            let a = pair.bodyA, b = pair.bodyB;
            balls.forEach(ball => {
                if ((a === ball && b === paddle) || (b === ball && a === paddle)) {
                    if (!powerupActive) {
                        gameRunning = false;
                    }
                }
                bricks.forEach((brick, index) => {
                    if ((a === ball && b === brick) || (b === ball && a === brick)) {
                        playSound('tick.wav');
                        World.remove(engine.world, brick);
                        bricks.splice(index, 1);
                        bricksDestroyed++;

                        if (Math.random() < 0.1) {
                            spawnPowerup(brick.position.x, brick.position.y);
                        }
                    }
                });
                powerups.forEach((powerup, index) => {
                    if ((a === powerup && b === paddle) || (b === powerup && a === paddle)) {
                        activatePowerup(powerup.label);
                        World.remove(engine.world, powerup);
                        powerups.splice(index, 1);
                    } else if ((a === powerup && b.label === 'floor') || (b === powerup && a.label === 'floor')) {
                        World.remove(engine.world, powerup);
                        powerups.splice(index, 1);
                    }
                });
            });
        });
    }

    function spawnNewBallIfNeeded() {
        let destroyedPercentage = bricksDestroyed / totalBricks;
        if (destroyedPercentage >= nextBallThreshold) {
            let newBall = Bodies.circle(300, 200, 10, { restitution: 1.05 });
            Body.setVelocity(newBall, { x: random(-5, 5), y: random(3, 5) });
            balls.push(newBall);
            World.add(engine.world, newBall);
            nextBallThreshold += 0.2;
        }
    }

    function spawnPowerup(x, y) {
        let type = Math.random() < 0.5 ? 'invincible' : 'deflect';
        let powerup = Bodies.circle(x, y, 10, { restitution: 0.5, label: type });
        powerup.visible = true;
        powerups.push(powerup);
        World.add(engine.world, powerup);
    }

    function activatePowerup(type) {
        clearTimeout(powerupTimer);
        powerupTimer = setTimeout(() => {
            paddleColor = '#FFFFFF';
            powerupActive = false;
        }, 3000);

        if (type === 'invincible') {
            paddleColor = '#808080';
        } else {
            paddleColor = '#FFFF00';
        }
        powerupActive = true;
    }

    function playSound(filename) {
        let sound = new Audio(filename);
        sound.play();
    }

    function checkWinCondition() {
        if (bricks.length === 0) {
            gameRunning = false;
            gameWon = true;
        }
    }

    function mouseMoved() {
        let newPositionX = Math.max(50, Math.min(mouseX, 550));
        Body.setPosition(paddle, { x: newPositionX, y: paddle.position.y });
    }
</script>
</body>
</html>
```

### Explanation:
- **Setup:** Initializes the canvas, physics engine, paddle, boundaries, bricks, and the initial ball.
- **Sound Effects:** `tick.wav` plays when a brick is hit, `gameOver.wav` plays on game over, and `win.wav` plays when the player wins. Make sure these files are available in the same folder as your HTML file.
- **Power-ups:** Each brick has a 10% chance to drop a power-up upon destruction, which can either make the paddle invincible or allow it to deflect balls.

Click anywhere on the page to enable sound playback during the game. Most browsers would not allow sound to be played until the user interacts with the page.