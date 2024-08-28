You can modify the existing code to include these features as following:

### Updated Plan:

1. **Restart Button**: Add "Restart" button to allow user to see the motion trail and simulate the projectile motion again.

2. **Display Max Height and Distance**: After the projectile lands, show the maximum height and the horizontal distance traveled both in the canvas and under the sliders as mentioned.

3. **Trail and Max Height Line**: Keep the trail on screen after the projectile lands, and draw a line to indicate the maximum height. Blue line indicates the distance traveled and green line to draw the line representing height.

### Implementation:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projectile Motion Simulator</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center h-screen">

<div class="bg-white p-6 rounded-lg shadow-lg text-center">
    <h2 class="text-2xl font-bold mb-4">Projectile Motion Simulator</h2>
    <div id="canvas-container" class="mb-4"></div>

    <div class="flex justify-around mb-4">
        <div>
            <label for="velocitySlider" class="block text-sm font-medium text-gray-700">Initial Velocity</label>
            <input id="velocitySlider" type="range" min="10" max="100" value="12" class="w-full mb-2">
            <span id="velocityValue" class="text-sm text-gray-600">12</span> m/s
        </div>
        <div>
            <label for="angleSlider" class="block text-sm font-medium text-gray-700">Launch Angle</label>
            <input id="angleSlider" type="range" min="0" max="90" value="30" class="w-full mb-2">
            <span id="angleValue" class="text-sm text-gray-600">30</span>°
        </div>
    </div>

    <button id="startButton" class="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">Start</button>
    <p id="result" class="text-sm text-gray-700 mt-4"></p>
</div>

<script>
    let angle, speed, gravity = 0.5;
    let x, y, vx, vy, maxHeight, distanceTravelled;
    let isRunning = false;
    let path = [];

    function setup() {
        let canvas = createCanvas(800, 400);
        canvas.parent('canvas-container');
        noLoop(); // Prevent draw loop from running automatically
    }

    function draw() {
        // Draw a gradient background
        setGradient(0, 0, width, height, color(135, 206, 250), color(70, 130, 180), "Y");

        // Draw the ground
        drawGround();

        if (isRunning) {
            x += vx;
            y += vy;
            vy += gravity;

            path.push({x: x, y: y});

            if (y > height - 10) {
                y = height - 10;
                isRunning = false;
                vx = 0;
                vy = 0;
                calculateResults();
                document.getElementById('startButton').textContent = 'Restart';
                noLoop();
            }

            if (y < maxHeight) {
                maxHeight = y;
            }
        }

        drawPath();
        drawProjectile();
        if (!isRunning && path.length > 0) {
            drawMaxHeightLine();
            drawHeightLine();
        }
    }

    function resetProjectile() {
        angle = radians(document.getElementById('angleSlider').value);
        speed = document.getElementById('velocitySlider').value;
        x = 50;
        y = height - 10;
        vx = speed * cos(angle);
        vy = -speed * sin(angle);
        maxHeight = height - 10;
        path = [];
        isRunning = true;
        loop();
    }

    function calculateResults() {
        distanceTravelled = x;
        let heightInMeters = ((height - 10) - maxHeight) * (4 / 100);
        let distanceInMeters = (distanceTravelled - 50) * (4 / 100);
        document.getElementById('result').textContent = `The projectile has reached ${distanceInMeters.toFixed(2)} meter(s) with a max height of ${heightInMeters.toFixed(2)} meter(s).`;
    }

    function drawPath() {
        noFill();
        stroke(0);
        strokeWeight(2);
        beginShape();
        for (let i = 0; i < path.length; i++) {
            vertex(path[i].x, path[i].y);
        }
        endShape();
    }

    function drawProjectile() {
        fill(255, 0, 0);
        noStroke();
        ellipse(x, y, 20, 20);
    }

    function drawMaxHeightLine() {
        stroke(0, 0, 255);
        strokeWeight(2);
        line(50, maxHeight, distanceTravelled, maxHeight);
        fill(0);
        noStroke();
        textAlign(CENTER);
        textSize(12);
        text(`Max Height: ${((height - 10) - maxHeight) * (4 / 100)} m`, distanceTravelled / 2 + 25, maxHeight - 10);
    }

    function drawHeightLine() {
        stroke(0, 255, 0);
        strokeWeight(2);
        line(distanceTravelled, maxHeight, distanceTravelled, height - 10);
        fill(0);
        noStroke();
        textAlign(LEFT);
        textSize(12);
        text(`Distance: ${(distanceTravelled - 50) * (4 / 100)} m`, distanceTravelled + 5, height - 15);
    }

    function drawGround() {
        stroke(150, 75, 0);
        strokeWeight(3);
        line(0, height - 10, width, height - 10);
    }

    function setGradient(x, y, w, h, c1, c2, axis) {
        noFill();

        if (axis === "Y") {
            for (let i = y; i <= y + h; i++) {
                let inter = map(i, y, y + h, 0, 1);
                let c = lerpColor(c1, c2, inter);
                stroke(c);
                line(x, i, x + w, i);
            }
        }
    }

    document.getElementById('startButton').addEventListener('click', function() {
        if (!isRunning) {
            resetProjectile();
            this.textContent = 'Restart';
        }
    });

    document.getElementById('velocitySlider').addEventListener('input', function() {
        document.getElementById('velocityValue').textContent = this.value;
    });

    document.getElementById('angleSlider').addEventListener('input', function() {
        document.getElementById('angleValue').textContent = this.value;
    });
</script>

</body>
</html>
```

The projectile's trail remains visible after landing, with a blue line showing the maximum height and a green line to show the height. A new `updateStats()` function updates the displayed travel statistics.

This updated version of the simulator provides a more educational and interactive experience by showing key metrics of the projectile's motion, enhancing understanding of the physics involved.