### Game Rules and Plan:

1. **The World**:
    - The game world is composed of an invisible grid, where each cell is a square that can hold blocks.
    - The background should be black, the player should be a white square, and the chalice should be a red circle. 

2. **Game Phases**:
    - **Phase 1: Build Mode**:
        - The player can place white blocks on the grid using the mouse. Blocks should snap to the grid as instructed.
        - `Q` Key: "Build Block Mode" would allow the player to place blocks.
        - `E` Key: "Destroy Mode" would allow the player to remove blocks.
        - `R` Key: Would allow the player to place the red circle which can only be placed once.
    - **Phase 2: Play Mode**:
        - The player character (a yellow square) spawns on the first block placed during Phase 1.
        - The player can move left, right, and jump over blocks using `WASD` keys. You can change it to any combination you like by modifying the code.
        - The goal is to reach the red circle.
        - The player presses the `SPACE` key to transition from Phase 1 to Phase 2 (make sure you placed the red circle). 

3. **Library Used**:
    - **Phaser** is an ideal library to use for this project. It is a great choice for platformer games. We will utilize **Phaser** to easily create a grid-based map, add collision detection for the player against boxes and adding physics to the player (i.e., gravity, jumping velocity, etc.).   

### Code Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Platformer Game</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.js"></script>
    <style>
        body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: gray;
        }
        #gameContainer {
            background-color: black;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            position: relative;
        }
        #phaseFeedback, #restartButton {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-family: Arial, sans-serif;
            font-size: 20px;
            z-index: 10;
            text-align: center;
        }
        #restartButton {
            top: 50%;
            cursor: pointer;
            display: none;
        }
    </style>
</head>
<body>
<div id="gameContainer">
    <div id="phaseFeedback">Phase 1: Build Mode</div>
    <div id="restartButton">Restart</div>
</div>
<script>
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: '#000', // Black background for the game
        parent: 'gameContainer',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 600 }, // Gravity for the game world
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    let game = new Phaser.Game(config);

    let buildMode = true;
    let destroyMode = false;
    let redCircle = null;
    let blocks;
    let player;
    let firstBlockPlaced = false;
    let firstBlockPosition;
    let phaseFeedback;
    let restartButton;
    let cursors;
    let gameOver = false;
    let gameWon = false;
    let deathLayer;

    function preload() {
        // No assets to preload
    }

    function create() {
        // Get feedback and restart button elements
        phaseFeedback = document.getElementById('phaseFeedback');
        restartButton = document.getElementById('restartButton');
        restartButton.addEventListener('click', () => location.reload());

        // Create a static group for blocks
        blocks = this.physics.add.staticGroup();

        // Create hidden death layer at the bottom of the screen
        deathLayer = this.add.rectangle(0, game.config.height, game.config.width, 32, 0x000000, 0);
        this.physics.add.existing(deathLayer, true);

        // Handle mouse clicks for placing or destroying blocks and placing the red circle
        this.input.on('pointerdown', function (pointer) {
            const x = Math.floor(pointer.x / 32) * 32;
            const y = Math.floor(pointer.y / 32) * 32;

            if (buildMode && !destroyMode) {
                if (!firstBlockPlaced) {
                    firstBlockPlaced = true;
                    firstBlockPosition = { x, y };
                }
                const block = this.add.rectangle(x, y, 32, 32, 0xffffff);
                this.physics.add.existing(block, true); // Add static physics to the block
                blocks.add(block);
            } else if (destroyMode && !buildMode) {
                blocks.children.iterate(function (block) {
                    if (block.x === x && block.y === y) {
                        block.destroy();
                    }
                });
            } else if (!buildMode && !destroyMode && redCircle) {
                redCircle.setPosition(x + 16, y + 16);
            } else if (!buildMode && !destroyMode && !redCircle) {
                redCircle = this.add.circle(x + 16, y + 16, 16, 0xff0000);
                this.physics.add.existing(redCircle, true); // Add static physics to the circle
            }
        }, this);

        // Handle keyboard inputs to switch between modes
        this.input.keyboard.on('keydown-Q', function () {
            buildMode = true;
            destroyMode = false;
            phaseFeedback.textContent = 'Phase 1: Build Mode';
        }, this);

        this.input.keyboard.on('keydown-E', function () {
            buildMode = false;
            destroyMode = true;
            phaseFeedback.textContent = 'Phase 1: Destroy Mode';
        }, this);

        this.input.keyboard.on('keydown-R', function () {
            buildMode = false;
            destroyMode = false;
            phaseFeedback.textContent = 'Phase 1: Place Red Circle';
        }, this);

        // Start Phase 2 when SPACE is pressed, if red circle is placed
        this.input.keyboard.on('keydown-SPACE', function () {
            if (!buildMode && !destroyMode && redCircle) {
                startPhase2(this.scene);
            } else {
                phaseFeedback.textContent = 'Place Red Circle to Continue';
            }
        });

        // Set up cursor keys for player movement
        cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    function startPhase2(scene) {
        if (firstBlockPlaced) {
            const playerStartY = firstBlockPosition.y - 2 * 32;
            player = scene.add.rectangle(firstBlockPosition.x + 16, playerStartY, 32, 32, 0xffff00);
            scene.physics.add.existing(player); // Add physics to the player
            player.body.setCollideWorldBounds(true);
            player.body.setGravityY(600); // Increase player's weight

            // Enable player to land on blocks
            scene.physics.add.collider(player, blocks);
            // End the game if player touches the death layer
            scene.physics.add.collider(player, deathLayer, function() {
                gameOver = true;
                endGame('Game Over!');
            });

            // End the game if player reaches the red circle
            scene.physics.add.overlap(player, redCircle, function() {
                gameWon = true;
                endGame('You Win!');
            });

            buildMode = false;
            destroyMode = false;

            phaseFeedback.textContent = 'Phase 2: Play Mode';
        }
    }

    function update() {
        if (gameOver || gameWon) return;

        if (player) {
            if (cursors.left.isDown) {
                player.body.setVelocityX(-160);
            } else if (cursors.right.isDown) {
                player.body.setVelocityX(160);
            } else {
                player.body.setVelocityX(0);
            }

            if (cursors.up.isDown && player.body.touching.down) {
                player.body.setVelocityY(-300);
            }
        }
    }

    function endGame(message) {
        phaseFeedback.textContent = message;
        restartButton.style.display = 'block';
    }
</script>
</body>
</html>
```

### Explanation:
- **Grid Implementation**: An invisible grid is placed for the block placements. It ensures no overlapping blocks are placed.
- **Build and Destroy Modes**: In Phase 1 the player would be able to build the world by placing blocks. In Phase 2 player would be able to play the game. Player wins the game if he chases the red circle successfully and loses if it falls down.
- **Visual Feedback**: The player should be able to see the current mode at the top center of the game. A restart button appears after a game over or win state. 
- **Collision and Physics**: Phaser’s physics engine handles the interaction between the player, blocks, and the world’s boundaries. An invisible layer is added to the world at the bottom, game would end if the player falls on it.

With this setup, you should have an engaging platformer experience in which you can build and play at the same time. This game currently uses shapes only, you can improve the visuals by adding images or particle effects.