### Code Plan:

1. UI:
   1. Create a game container centered on a page with a white background and shadow for depth.
   2. Add a progress display to Show discovered elements count located at the top of the container.
   3. Create a flexbox layout to show the discovered elements. 
   4. Three square boxes arranged horizontally:
       - Box 1 + Box 2 = Box 3 layout
       - Dashed borders for drag targets
   5. Add a combine button with a blue background and hover effect.
   6. Result display shows combination results or messages.
   7. Win message should Appear when all elements are discovered.

2. Gameplay:
   1. Start the game with 4 basic elements. The player attempts to combine two elements.
   2. Add new elements to the discovered list if not found yet.
   3. Display a congratulatory message when all elements are found.

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alchemy Combination Game</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f0f4f8;
            color: #333;
        }
        .game-container {
            background-color: #ffffff;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 30px;
            width: 90%;
            max-width: 600px;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
        }
        .elements {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin-bottom: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 10px;
        }
        .element {
            width: 70px;
            height: 70px;
            border: 2px solid #3498db;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: move;
            font-weight: bold;
            transition: all 0.3s ease;
            background-color: #fff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .element:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }
        .element-emoji {
            font-size: 24px;
            margin-bottom: 5px;
        }
        .combination-area {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-bottom: 30px;
        }
        .combination-slot {
            width: 80px;
            height: 80px;
            border: 2px dashed #3498db;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            background-color: #f8f9fa;
        }
        .combine-button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .combine-button:hover {
            background-color: #2980b9;
        }
        #result {
            font-size: 18px;
            margin-top: 20px;
            min-height: 50px;
            text-align: center;
            color: #2c3e50;
        }
        .discovered {
            animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        #progress {
            font-size: 18px;
            margin-top: 20px;
            text-align: center;
            color: #7f8c8d;
        }
        #winMessage {
            font-size: 24px;
            font-weight: bold;
            color: #27ae60;
            margin-top: 20px;
            text-align: center;
            display: none;
        }
    </style>
</head>
<body>
<div class="game-container">
    <h1>Alchemy Combination Game</h1>
    <div id="progress"></div>
    <div class="elements" id="elements"></div>
    <div class="combination-area">
        <div class="combination-slot" id="slot1" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
        <div>+</div>
        <div class="combination-slot" id="slot2" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
        <div>=</div>
        <div class="combination-slot" id="resultSlot"></div>
    </div>
    <div style="text-align: center;">
        <button class="combine-button" onclick="combineElements()">Combine</button>
    </div>
    <div id="result"></div>
    <div id="winMessage"></div>
</div>
<script>
    const allElements = {
        'Fire': '🔥', 'Water': '💧', 'Earth': '🌎', 'Air': '💨',
        'Steam': '☁️', 'Lava': '🌋', 'Dust': '💨', 'Mud': '⛰️',
        'Energy': '⚡', 'Life': '🌱'
    };

    const basicElements = ['Fire', 'Water', 'Earth', 'Air'];
    let discoveredElements = [...basicElements];

    const combinations = {
        'Fire+Water': 'Steam',
        'Earth+Fire': 'Lava',
        'Air+Earth': 'Dust',
        'Earth+Water': 'Mud',
        'Air+Fire': 'Energy',
        'Energy+Water': 'Life'
    };

    function updateProgress() {
        const progressDiv = document.getElementById('progress');
        progressDiv.textContent = `Progress: ${discoveredElements.length} out of ${Object.keys(allElements).length} elements discovered`;

        if (discoveredElements.length === Object.keys(allElements).length) {
            const winMessageDiv = document.getElementById('winMessage');
            winMessageDiv.textContent = 'Congratulations! You have discovered all elements!';
            winMessageDiv.style.display = 'block';
        }
    }

    function createElementButtons() {
        const container = document.getElementById('elements');
        container.innerHTML = '';
        discoveredElements.forEach(name => {
            const button = document.createElement('div');
            button.className = 'element';
            button.innerHTML = `<span class="element-emoji">${allElements[name]}</span><span>${name}</span>`;
            button.draggable = true;
            button.ondragstart = (event) => drag(event, name);
            container.appendChild(button);
        });
        updateProgress();
    }

    function drag(event, name) {
        event.dataTransfer.setData("text", name);
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const name = event.dataTransfer.getData("text");
        event.target.innerHTML = `<span class="element-emoji">${allElements[name]}</span>`;
        event.target.dataset.element = name;

        document.getElementById('resultSlot').innerHTML = '';
        document.getElementById('result').innerHTML = '';
    }

    function combineElements() {
        const slot1 = document.getElementById('slot1');
        const slot2 = document.getElementById('slot2');
        const resultSlot = document.getElementById('resultSlot');
        const resultDiv = document.getElementById('result');

        if (!slot1.dataset.element || !slot2.dataset.element) {
            resultDiv.innerHTML = 'Please drag two elements into the slots to combine.';
            return;
        }

        const element1 = slot1.dataset.element;
        const element2 = slot2.dataset.element;
        const combination = [element1, element2].sort().join('+');
        const result = combinations[combination];

        if (result) {
            resultSlot.innerHTML = `<span class="element-emoji">${allElements[result]}</span>`;
            if (!discoveredElements.includes(result)) {
                discoveredElements.push(result);
                resultDiv.innerHTML = `You discovered a new element: ${result}!`;
                createElementButtons();
                document.querySelector(`.element:last-child`).classList.add('discovered');
            } else {
                resultDiv.innerHTML = `You created ${result}!`;
            }
        } else {
            resultSlot.innerHTML = '';
            resultDiv.innerHTML = 'No new element created. Try a different combination!';
        }
        
        slot1.innerHTML = '';
        slot2.innerHTML = '';
        delete slot1.dataset.element;
        delete slot2.dataset.element;
    }

    createElementButtons();
</script>
</body>
</html>
```

### Explanation

The game uses a combination of HTML5 drag-and-drop API and custom JavaScript logic to create the alchemy system. Key technical aspects include:

1. Data Structures:
    - `allElements` object maps element names to Unicode symbols.
    - `combinations` object stores valid element combinations.

2. DOM Manipulation:
    - `createElementButtons()` dynamically generates draggable element buttons.
    - `updateProgress()` modifies the DOM to reflect current game state.

3. Game Logic:
    - `combineElements()` checks for valid combinations and updates game state.
    - Element discovery is tracked in the `discoveredElements` array.

4. CSS:
    - Flexbox is used for layout centering and alignment.
    - CSS transitions provide smooth visual feedback.

The code implements a drag-and-drop alchemy game where players combine elements to discover new ones, 
you can make the game more addictive by adding additional combinations of elements.