Here's a basic implementation of a Fruit Ninja-inspired game using Matter.js with the requirements you've specified:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fruit Ninja with Matter.js</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.14.2/matter.min.js"></script>
    <style>
        body { margin: 0; overflow: hidden; }
        #gameCanvas { display: block; }
        #uiLayer { position: absolute; top: 10px; left: 10px; color: white; font-family: Arial, sans-serif; }
        #highScore { position: absolute; top: 10px; right: 10px; color: white; }
        #endScreen { display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 20px; text-align: center; }
    </style>
</head>
<body>
    <div id="uiLayer">
        <div>Score: <span id="score">0</span></div>
        <div>Time: <span id="timer">30</span>s</div>
    </div>
    <div id="highScore">High Score: <span id="highScoreValue">0</span></div>
    <div id="endScreen">
        <h2>Time's Up!</h2>
        <p>Your Score: <span id="finalScore"></span></p>
        <button onclick="restartGame()">Restart</button>
    </div>
    <canvas id="gameCanvas"></canvas>
    <script>
    const Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create();
    const render = Render.create({
        element: document.body,
        canvas: document.getElementById('gameCanvas'),
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false,
            background: '#111'
        }
    });

    const fruits = [];
    const particles = [];
    let score = 0;
    let highScore = localStorage.getItem('fruitNinjaHighScore') || 0;
    document.getElementById('highScoreValue').textContent = highScore;

    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    World.add(engine.world, [ground]);

    // Mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    World.add(engine.world, mouseConstraint);

    // Fruit types with point values
    const fruitTypes = [
        { color: 'red', points: 10, radius: 20 },    // Apple
        { color: 'yellow', points: 15, radius: 25 }, // Banana
        { color: 'green', points: 20, radius: 30 }   // Watermelon
    ];

    function createFruit() {
        const type = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
        const fruit = Bodies.circle(
            Math.random() * 800, 
            650, 
            type.radius, 
            {
                restitution: 0.5,
                friction: 0.001,
                render: { fillStyle: type.color },
                points: type.points
            }
        );
        Matter.Body.setVelocity(fruit, { 
            x: Math.random() * 10 - 5, 
            y: -Math.random() * 10 - 5
        });
        fruits.push(fruit);
        World.add(engine.world, fruit);
    }

    // Slicing effect
    function sliceFruit(fruit) {
        score += fruit.points;
        document.getElementById('score').textContent = score;
        if(score > highScore) {
            highScore = score;
            document.getElementById('highScoreValue').textContent = highScore;
            localStorage.setItem('fruitNinjaHighScore', highScore);
        }

        // Create particles for splash effect
        for(let i = 0; i < 10; i++) {
            const particle = Bodies.circle(fruit.position.x, fruit.position.y, 2, {
                friction: 0.05,
                frictionAir: 0.05,
                render: { fillStyle: fruit.render.fillStyle }
            });
            Matter.Body.setVelocity(particle, { 
                x: (Math.random() - 0.5) * 8, 
                y: (Math.random() - 0.5) * 8 
            });
            particles.push(particle);
            World.add(engine.world, particle);
        }

        World.remove(engine.world, fruit);
        fruits.splice(fruits.indexOf(fruit), 1);
    }

    // Fruit spawning
    setInterval(() => {
        for(let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
            createFruit();
        }
    }, 500);

    // Timer
    let timeLeft = 30;
    const timerId = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(timerId);
            document.getElementById('endScreen').style.display = 'block';
            document.getElementById('finalScore').textContent = score;
        }
    }, 1000);

    // Collision event for slicing
    Matter.Events.on(engine, 'collisionStart', event => {
        const pairs = event.pairs;
        pairs.forEach(pair => {
            if(pair.bodyA === mouseConstraint.body || pair.bodyB === mouseConstraint.body) {
                if(fruits.includes(pair.bodyA)) sliceFruit(pair.bodyA);
                else if(fruits.includes(pair.bodyB)) sliceFruit(pair.bodyB);
            }
        });
    });

    // Clean up particles
    function cleanParticles() {
        particles.forEach((particle, index) => {
            if(particle.position.y > 600 || particle.position.x < 0 || particle.position.x > 800) {
                World.remove(engine.world, particle);
                particles.splice(index, 1);
            }
        });
    }

    Matter.Events.on(engine, 'afterUpdate', cleanParticles);

    function restartGame() {
        score = 0;
        document.getElementById('score').textContent = score;
        timeLeft = 30;
        document.getElementById('timer').textContent = timeLeft;
        document.getElementById('endScreen').style.display = 'none';
        fruits.forEach(fruit => World.remove(engine.world, fruit));
        fruits.length = 0;
        particles.forEach(particle => World.remove(engine.world, particle));
        particles.length = 0;
        setInterval(() => {
            timeLeft--;
            document.getElementById('timer').textContent = timeLeft;
            if(timeLeft <= 0) {
                clearInterval(this);
                document.getElementById('endScreen').style.display = 'block';
                document.getElementById('finalScore').textContent = score;
            }
        }, 1000);
    }

    Engine.run(engine);
    Render.run(render);
    </script>
</body>
</html>
```

**Explanation:**
- **HTML/CSS**: Sets up the canvas for rendering, UI for score, timer, and end game screen.
- **JavaScript with Matter.js**:
  - **Engine and Render**: Set up Matter.js engine and renderer.
  - **Fruits**: Different types of fruits are created with varying sizes, colors, and points. They are thrown from the bottom with random velocities.
  - **Slicing**: When the mouse (acting as a blade) collides with a fruit, it triggers the slice effect, creating particles and updating the score.
  - **Timer**: A 30-second timer counts down, ending the game when it reaches zero.
  - **Particles**: For each slice, particles are created to simulate a splash effect.
  - **Game Loop**: Fruits are spawned periodically, and particles are cleaned up to prevent performance issues.
  - **Restart**: A function to restart the game by resetting scores, timers, and clearing objects from the world.

This code provides a basic implementation. You might want to refine the physics, add sounds, or improve the graphics for a more polished game.