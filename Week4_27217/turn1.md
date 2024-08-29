### Code Plan:

1. **Setup Phaser**: Use CDN for Phaser library.
2. **Player Creation**:
    - Player controls a with square that moves within the world using WASD keys.
    - Player should not be able to move outside the screen.
3. **Building Blocks**:
    - Player should be able to create solid yellow blocks using IJKL keys.
    - Make sure blocks can created diagonally too.
4. **Collision**: Set up collision between the player and the blocks to prevent passing through.

### HTML/CSS/JS Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phaser Top-Down Game</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #2d2d2d;
        }
        #gameContainer {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
        }
        canvas {
            display: block;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
</head>
<body>
<div id="gameContainer"></div>
<script>
    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: 'gameContainer',
        backgroundColor: '#2d2d2d',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    const game = new Phaser.Game(config);

    let player;
    let cursors;
    let blockKeys;
    let blocks;

    function preload() {
        // No assets to load
    }

    function create() {
        player = this.add.rectangle(400, 300, 32, 32, 0xffffff);
        this.physics.add.existing(player);
        player.body.setCollideWorldBounds(true);

        blocks = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        this.physics.add.collider(player, blocks);

        cursors = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D
        });

        blockKeys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.I,
            'down': Phaser.Input.Keyboard.KeyCodes.K,
            'left': Phaser.Input.Keyboard.KeyCodes.J,
            'right': Phaser.Input.Keyboard.KeyCodes.L
        });
    }

    function update() {
        player.body.setVelocity(0);

        if (cursors.left.isDown) {
            player.body.setVelocityX(-160);
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(160);
        }

        if (cursors.up.isDown) {
            player.body.setVelocityY(-160);
        } else if (cursors.down.isDown) {
            player.body.setVelocityY(160);
        }

        handleBlockCreation.call(this);
    }

    function handleBlockCreation() {
        const keysPressed = [];

        if (blockKeys.left.isDown) keysPressed.push('left');
        if (blockKeys.right.isDown) keysPressed.push('right');
        if (blockKeys.up.isDown) keysPressed.push('up');
        if (blockKeys.down.isDown) keysPressed.push('down');

        if (keysPressed.length === 1) {
            createSingleBlock.call(this, keysPressed[0]);
        } else if (keysPressed.length === 2) {
            createDiagonalBlock.call(this, keysPressed);
        }
    }

    function createSingleBlock(direction) {
        let x = player.x;
        let y = player.y;

        if (direction === 'left') x -= 32;
        if (direction === 'right') x += 32;
        if (direction === 'up') y -= 32;
        if (direction === 'down') y += 32;

        createBlock(this, x, y);
    }

    function createDiagonalBlock(directions) {
        let x = player.x;
        let y = player.y;

        directions.forEach(direction => {
            if (direction === 'left') x -= 32;
            if (direction === 'right') x += 32;
            if (direction === 'up') y -= 32;
            if (direction === 'down') y += 32;
        });

        createBlock(this, x, y);
    }

    function createBlock(scene, x, y) {
        const block = scene.add.rectangle(x, y, 32, 32, 0xffff00);
        scene.physics.add.existing(block);
        block.body.setImmovable(true);
        blocks.add(block);
    }
</script>
</body>
</html>
```

The game is configured to fill the entire screen using `window.innerWidth` and `window.innerHeight`. By setting `setCollideWorldBounds(true)` we make sure the player is confined within the game world. Block can be crated by the player pressing the right keys which also supports diagonal block creation.