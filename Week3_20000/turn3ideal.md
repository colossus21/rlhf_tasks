<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Radioactive Decay Simulation</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #000;
            color: #fff;
            font-family: monospace;
        }
        #info {
            position: absolute;
            bottom: 10px;
            right: 10px;
            text-align: right;
        }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/decimal.js/decimal.min.js"></script>
</head>
<body>
<div id="info">
    <div id="clock">Time: 0</div>
    <div id="particles">Particles left: 1000</div>
</div>

<script>
let particles = [];
const N0 = 1000; // Initial number of particles
const lambda = new Decimal('0.0001'); // Decay constant
let time = 0;
const timeStep = 10; // Increase time by this amount each frame

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < N0; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            decayed: false
        });
    }
}

function draw() {
    background(0, 10); // Semi-transparent background for motion blur effect
    
    // Update time and calculate decay
    time += timeStep;
    let N = new Decimal(N0).mul(Decimal.exp(lambda.mul(-time)));
    let currentParticles = N.toNumber();

    // Decay particles
    for (let p of particles) {
        if (!p.decayed && particles.length > currentParticles) {
            p.decayed = true;
            // Here you could add some visual effect for decay
        }
        if (!p.decayed) {
            // Move particle or change its appearance
            p.x += random(-2, 2);
            p.y += random(-2, 2);
            
            // Keep particle within screen
            p.x = (p.x + width) % width;
            p.y = (p.y + height) % height;
            
            // Draw particle
            fill(255, 255, 0); // Yellow for not decayed
            noStroke();
            ellipse(p.x, p.y, 5, 5);
        }
    }

    // Update UI
    document.getElementById('clock').textContent = `Time: ${Math.floor(time)}`;
    document.getElementById('particles').textContent = `Particles left: ${Math.floor(currentParticles)}`;
}

// Reset canvas size on window resize
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

</script>
</body>
</html>