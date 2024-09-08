### Code Plan:

1. Create the game scene with necessary variables.
2. Create a function to initialize game objects, spawning and collecting shapes.
3. Player scores should be shown top-left and top-right for player 1 and player 2 respectively.
4. Implement the timer and game-over logic. The UI should show which player wins.
5. Each shape has unique point values—yellow stars (10 points, 20% chance), magenta circles (7 points, 30% chance), and cyan triangles (5 points, 50% chance).

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shape Collectors</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #ffafbd, #ffc3a0);
        }
        #restartButton {
            display: none;
            position: absolute;
            top: 60%;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            font-size: 18px;
            color: white;
            background-color: #007BFF;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #restartButton:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
<button id="restartButton" onclick="restartGame()">Restart</button>

<script>
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: {
            create: create,
            update: update
        },
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        }
    };

    let game = new Phaser.Game(config);

    // Game variables
    let player1, player2, shapes, scoreText1, scoreText2, timeText, winnerText;
    let score1 = 0, score2 = 0;
    let gameTime = 30;  // Set the timer to 30 seconds
    let gameOver = false;
    let scene;  // To store the current scene

    function create() {
        scene = this;  // Assign the scene context
        gameOver = false;
        score1 = 0;
        score2 = 0;
        gameTime = 30;  // Set the game time to 30 seconds

        player1 = scene.add.rectangle(50, 50, 30, 30, 0xFF4500).setStrokeStyle(3, 0xFFFFFF);
        player2 = scene.add.rectangle(750, 550, 30, 30, 0x1E90FF).setStrokeStyle(3, 0xFFFFFF);

        scene.physics.add.existing(player1);
        scene.physics.add.existing(player2);

        player1.body.setDamping(true).setDrag(0.9).setMaxVelocity(200);
        player2.body.setDamping(true).setDrag(0.9).setMaxVelocity(200);

        // Create shape group
        shapes = scene.physics.add.group();

        // Display scores and timer
        scoreText1 = scene.add.text(16, 16, 'Player 1: 0', { fontSize: '18px', fill: '#FF4500', fontFamily: 'Arial' });
        scoreText2 = scene.add.text(650, 16, 'Player 2: 0', { fontSize: '18px', fill: '#1E90FF', fontFamily: 'Arial' });
        timeText = scene.add.text(350, 16, 'Time: 30', { fontSize: '18px', fill: '#FFFFFF', fontFamily: 'Arial' });

        // Spawn shapes every second
        scene.time.addEvent({
            delay: 1000,
            callback: spawnShape,
            callbackScope: scene,
            loop: true
        });

        // Countdown timer event, repeat 29 times for a 30-second timer
        scene.time.addEvent({
            delay: 1000,
            callback: updateTimer,
            callbackScope: scene,
            repeat: 29
        });

        // Detect collision between players and shapes
        scene.physics.add.overlap(player1, shapes, collectShape, null, scene);
        scene.physics.add.overlap(player2, shapes, collectShape, null, scene);
    }

    function update() {
        if (gameOver) return;

        // Player 1 controls (WASD)
        const cursors = scene.input.keyboard.addKeys('W,A,S,D');
        if (cursors.A.isDown) player1.body.setVelocityX(-200);
        else if (cursors.D.isDown) player1.body.setVelocityX(200);
        else player1.body.setVelocityX(0);

        if (cursors.W.isDown) player1.body.setVelocityY(-200);
        else if (cursors.S.isDown) player1.body.setVelocityY(200);
        else player1.body.setVelocityY(0);

        // Player 2 controls (Arrow keys)
        const cursors2 = scene.input.keyboard.createCursorKeys();
        if (cursors2.left.isDown) player2.body.setVelocityX(-200);
        else if (cursors2.right.isDown) player2.body.setVelocityX(200);
        else player2.body.setVelocityX(0);

        if (cursors2.up.isDown) player2.body.setVelocityY(-200);
        else if (cursors2.down.isDown) player2.body.setVelocityY(200);
        else player2.body.setVelocityY(0);
    }

    function spawnShape() {
        if (gameOver) return;

        // Randomly spawn shapes
        const x = Phaser.Math.Between(50, 750);
        const y = Phaser.Math.Between(50, 550);
        const random = Math.random();

        let shape;
        if (random < 0.2) {  // 20% chance to spawn a star
            shape = scene.add.star(x, y, 5, 15, 30, 0xFFFF00);
            shape.points = 10;
        } else if (random < 0.5) {  // 30% chance to spawn a circle
            shape = scene.add.circle(x, y, 15, 0xFF00FF);
            shape.points = 7;
        } else {  // 50% chance to spawn a triangle
            shape = scene.add.triangle(x, y, 0, 30, 15, 0, 30, 30, 0x00FFFF);
            shape.points = 5;
        }

        // Add rotation animation to the shape
        scene.tweens.add({
            targets: shape,
            angle: 360,
            duration: 2000,
            ease: 'Power2',
            loop: -1
        });

        scene.physics.add.existing(shape);
        shapes.add(shape);
    }

    function collectShape(player, shape) {
        if (gameOver) return;

        shape.destroy();

        // Update scores when a player collects a shape
        if (player === player1) {
            score1 += shape.points;
            scoreText1.setText('Player 1: ' + score1);
        } else {
            score2 += shape.points;
            scoreText2.setText('Player 2: ' + score2);
        }
    }

    function updateTimer() {
        if (gameOver) return;

        // Update the countdown timer
        gameTime--;
        timeText.setText('Time: ' + gameTime);

        // When time runs out, declare the winner or tie
        if (gameTime <= 0) {
            scene.physics.pause();
            gameOver = true;

            let message;
            if (score1 > score2) message = 'Player 1 Wins!';
            else if (score2 > score1) message = 'Player 2 Wins!';
            else message = 'It\'s a Tie!';

            displayWinner(message);
        }
    }

    function displayWinner(message) {
        // Show the winner or tie message
        winnerText = scene.add.text(400, 300, message, {
            fontSize: '32px',
            fill: '#FFFFFF',
            fontFamily: 'Arial',
            backgroundColor: '#000000',
            padding: {
                left: 10,
                right: 10,
                top: 5,
                bottom: 5
            }
        }).setOrigin(0.5);

        // Show the restart button below the message
        document.getElementById('restartButton').style.display = 'block';
    }

    function restartGame() {
        // Hide the restart button and restart the game
        document.getElementById('restartButton').style.display = 'none';

        game.destroy(true);
        game = new Phaser.Game(config);
    }
</script>
</body>
</html>
```

### Explanation:

1. Game Implementation:
   - The code sets up a Phaser game with a canvas of 800x600 pixels.
   - It uses the arcade physics system for simple collision detection.
   - The code defines variables for players, shapes, scores, timer, and game state.
   - Handles player movement using WASD keys for Player 1 and arrow keys for Player 2.
   - Players move with a maximum velocity of 200 and have drag for smooth movement.
   - The `spawnShape` function randomly creates stars, circles, or triangles with different point values.
   - The `collectShape` function handles point allocation when players overlap with shapes.
   - A 30-second countdown timer is implemented. When the timer reaches zero, the game pauses and displays the winner or declares a tie. 

2. Styling:
   - The game is centered on the page using flexbox.
   - Player 1 is a red square and player 2 is a blue square. 
   - All the shapes spawned should have spinning animations.
   - A gradient background is applied to the body for visual enhancement.

The code implements an engaging two-player game where players compete to collect shapes within a time limit.