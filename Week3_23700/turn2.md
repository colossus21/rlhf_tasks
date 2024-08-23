I'll implement these additions to improve the game's appearance and functionality. Here's the updated version with your requested changes:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Row a Boat</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
        }
        #gameContainer {
            position: relative;
        }
        canvas {
            border: 2px solid #333;
        }
        #gameOver {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.8);
            padding: 20px;
            text-align: center;
            border-radius: 10px;
            display: none;
        }
        #restartButton {
            margin-top: 10px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
        }
    </style>
</head>
<body>
<div id="gameContainer">
    <canvas id="gameCanvas" width="400" height="600"></canvas>
    <div id="gameOver">
        <h2>Game Over</h2>
        <p>Your score: <span id="finalScore"></span></p>
        <button id="restartButton">Restart Game</button>
    </div>
</div>

<script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gameOverScreen = document.getElementById('gameOver');
    const finalScoreSpan = document.getElementById('finalScore');
    const restartButton = document.getElementById('restartButton');

    let boat;
    let obstacles;
    let score;
    let gameOver;
    let boatImage;

    function initGame() {
        boat = {
            x: canvas.width / 2,
            y: canvas.height - 50,
            width: 40,
            height: 60,
            speed: 5
        };

        obstacles = [];
        score = 0;
        gameOver = false;

        gameOverScreen.style.display = 'none';
    }

    function loadBoatImage() {
        return new Promise((resolve) => {
            boatImage = new Image();
            boatImage.src = 'boat.png';
            boatImage.onload = resolve;
        });
    }

    function drawWater() {
        ctx.fillStyle = '#ADD8E6';  // Light blue for water
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add some wave effect
        ctx.strokeStyle = '#87CEEB';
        for (let i = 0; i < canvas.height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            for (let j = 0; j < canvas.width; j += 20) {
                ctx.lineTo(j + 10, i + Math.sin(i + j * 0.1) * 5);
            }
            ctx.stroke();
        }
    }

    function drawBoat() {
        ctx.save();
        ctx.translate(boat.x + boat.width / 2, boat.y + boat.height / 2);
        ctx.rotate(0);  // No rotation, boat points upwards
        ctx.drawImage(boatImage, -boat.width / 2, -boat.height / 2, boat.width, boat.height);
        ctx.restore();
    }

    function drawObstacles() {
        obstacles.forEach(obstacle => {
            ctx.fillStyle = obstacle.color;
            if (obstacle.type === 'rock') {
                ctx.beginPath();
                ctx.arc(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (obstacle.type === 'plank') {
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            } else if (obstacle.type === 'iceberg') {
                ctx.fillStyle = 'blue';  // Make iceberg blue
                ctx.beginPath();
                ctx.moveTo(obstacle.x, obstacle.y + obstacle.height);
                ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y);
                ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
                ctx.closePath();
                ctx.fill();
            }
        });
    }

    function moveBoat(dx, dy) {
        boat.x += dx * boat.speed;
        boat.y += dy * boat.speed * 0.5; // Make vertical movement harder

        // Keep the boat within canvas bounds
        boat.x = Math.max(0, Math.min(canvas.width - boat.width, boat.x));
        boat.y = Math.max(0, Math.min(canvas.height - boat.height, boat.y));
    }

    function createObstacle() {
        const types = ['rock', 'plank', 'iceberg'];
        const type = types[Math.floor(Math.random() * types.length)];
        let width, height, color;

        switch (type) {
            case 'rock':
                width = height = 20 + Math.random() * 10;  // Smaller rocks
                color = 'gray';
                break;
            case 'plank':
                width = 60 + Math.random() * 20;  // Medium-sized wood planks
                height = 20;
                color = 'brown';
                break;
            case 'iceberg':
                width = height = 50 + Math.random() * 30;  // Largest icebergs
                color = 'lightblue';
                break;
        }

        const obstacle = {
            x: Math.random() * (canvas.width - width),
            y: -height,
            width: width,
            height: height,
            speed: 1 + Math.random() * 2,
            type: type,
            color: color
        };
        obstacles.push(obstacle);
    }

    function updateObstacles() {
        obstacles.forEach(obstacle => {
            obstacle.y += obstacle.speed;
        });

        obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
    }

    function checkCollision() {
        return obstacles.some(obstacle =>
                boat.x < obstacle.x + obstacle.width &&
                boat.x + boat.width > obstacle.x &&
                boat.y < obstacle.y + obstacle.height &&
                boat.y + boat.height > obstacle.y
        );
    }

    function drawScore() {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 30);
    }

    function gameLoop() {
        if (gameOver) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawWater();
        drawBoat();
        drawObstacles();
        updateObstacles();
        drawScore();

        if (checkCollision()) {
            gameOver = true;
            finalScoreSpan.textContent = score;
            gameOverScreen.style.display = 'block';
            return;
        }

        if (Math.random() < 0.02) {
            createObstacle();
        }

        requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', (e) => {
        if (gameOver) return;

        switch (e.key) {
            case 'ArrowLeft':
                moveBoat(-1, 0);
                break;
            case 'ArrowRight':
                moveBoat(1, 0);
                break;
            case 'ArrowUp':
                moveBoat(0, -1);
                break;
            case 'ArrowDown':
                moveBoat(0, 1);
                break;
        }
    });

    restartButton.addEventListener('click', () => {
        initGame();
        gameLoop();
    });

    async function startGame() {
        await loadBoatImage();
        initGame();
        gameLoop();

        setInterval(() => {
            if (!gameOver) score++;
        }, 1000)
    }

    startGame();
</script>
</body>
</html>
```

Here are the changes I've made to address your requests:

1. The river now has a light blue color with a simple wave effect to make it look more like water.
2. The boat is now represented by an image ('boat.png'). Make sure to have a 'boat.png' file in the same directory as your HTML file.
3. Three types of obstacles have been added: small rocks (gray circles), medium planks (brown rectangles), and big icebergs (blue triangles).
4. Instead of using an alert, the game over screen and score are now shown on the canvas itself.
5. A restart game button has been added, which appears when the game is over.

To use this code:

1. Save it as an HTML file.
2. Place a 'boat.png' image in the same directory as the HTML file. The image should be a top-down view of a boat.
3. Open the HTML file in a web browser to play the game.

The game now looks more visually appealing and has improved gameplay with different obstacle types. The game over screen is integrated into the canvas, providing a smoother user experience. Players can easily restart the game using the provided button.