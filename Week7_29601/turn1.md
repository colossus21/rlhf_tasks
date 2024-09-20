### Code Plan:

1. UI Plan:
   1. Create a centered container for the game elements.
   2. Design a 5x5 grid for the emoji tiles.
   3. Add a "Combine" button below the grid.
   4. Include a message area for feedback.
   5. Display a counter for found recipes.
   6. Create a section to show discovered recipes.
   7. Add a congratulatory message element (initially hidden).

2. Gameplay Plan:
   1. Initialize the game with recipes and emoji data.
   2. Populate the grid with random emojis from the recipe ingredients.
   3. Implement tile selection functionality.
   4. Create a function to check selected emojis against recipes.
   5. Update the UI when a recipe is found or not found.
   6. Track found recipes and update the counter.
   7. Display discovered recipes with emojis and names.
   8. Show the congratulatory message when all recipes are found.

### Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emoji Recipes</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: 'Arial', sans-serif;
            background-color: #f0f8ff;
        }

        .container {
            text-align: center;
            padding: 20px;
            margin: 10px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        h1 {
            margin-bottom: 20px;
            font-size: 32px;
            color: #333;
        }

        #message {
            font-size: 18px;
            color: #006400;
            margin-bottom: 20px;
            min-height: 30px;
            transition: opacity 0.5s ease;
        }

        #congrats {
            font-size: 22px;
            color: orangered;
            font-weight: bold;
            margin-top: 20px;
            opacity: 0;
            transition: opacity 1s ease;
        }

        #game-board {
            display: grid;
            grid-template-columns: repeat(5, 70px);
            grid-template-rows: repeat(5, 70px);
            gap: 10px;
            justify-content: center;
            margin-bottom: 20px;
        }

        .tile {
            width: 70px;
            height: 70px;
            font-size: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fff;
            border: 2px solid #ddd;
            cursor: pointer;
            user-select: none;
            transition: transform 0.2s, background-color 0.2s;
        }

        .tile.selected {
            background-color: #ffe4b5;
            transform: scale(1.1);
            border-color: #ffa500;
        }

        button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            background-color: #32cd32;
            color: white;
            border: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #228b22;
        }

        #counter {
            font-size: 18px;
            margin-top: 20px;
            color: #006400;
        }

        #found-recipes {
            margin-top: 20px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            justify-items: center;
        }

        .recipe-card {
            display: flex;
            align-items: center;
            background-color: #fff;
            border: 2px solid #ddd;
            padding: 10px;
            border-radius: 8px;
            width: 90%;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            opacity: 0;
            transition: opacity 0.5s ease, transform 0.3s;
            transform: translateY(10px);
        }

        .recipe-card.show {
            opacity: 1;
            transform: translateY(0);
        }

        .recipe-card .emoji {
            font-size: 32px;
            margin-right: 10px;
        }

        .recipe-card .name {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Emoji Recipes</h1>
    <div id="message"></div>
    <div id="game-board"></div>
    <button id="combine-button">Combine</button>
    <div id="congrats">🎉 Congratulations! You've found all the recipes! 🎉</div>
    <div id="counter">Recipes Found: 0/10</div>
    <div id="found-recipes"></div>
</div>

<script>
    const recipes = [
        { ingredients: ['🫓', '🍅', '🧀'], result: '🍕', name: 'Pizza' },
        { ingredients: ['🍞', '🥩', '🧀'], result: '🍔', name: 'Hamburger' },
        { ingredients: ['🥖', '🥩'], result: '🌭', name: 'Hot Dog' },
        { ingredients: ['🌽', '🍳'], result: '🍿', name: 'Popcorn' },
        { ingredients: ['🥬', '🥕', '🥒'], result: '🥗', name: 'Salad' },
        { ingredients: ['🍌', '🍓', '🥛'], result: '🥤', name: 'Milkshake' },
        { ingredients: ['🍰', '🍫', '🍓'], result: '🧁', name: 'Cupcake' },
        { ingredients: ['🥔', '🔪', '🧂'], result: '🍟', name: 'French Fries' },
        { ingredients: ['🍦', '🍫', '🍒'], result: '🍨', name: 'Ice Cream Sundae' },
        { ingredients: ['🐟', '🍚', '🥒'], result: '🍣', name: 'Sushi' }
    ];

    const emojis = [
        '🫓', '🍅', '🧀', '🍞', '🥩',
        '🥖', '🌽', '🍳', '🥬', '🥕',
        '🥒', '🍰', '🍓', '🍫', '🍒',
        '🔪', '🧂', '🥔', '🍦', '🍚',
        '🐟', '🍌', '🥛', '', ''
    ];

    let foundRecipes = 0;
    let selectedEmojis = [];
    const foundRecipeIcons = [];

    // Create the game board
    function createBoard() {
        const gameBoard = document.getElementById('game-board');
        emojis.forEach((emoji, index) => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.textContent = emoji;
            tile.dataset.index = index;
            tile.addEventListener('click', selectTile);
            gameBoard.appendChild(tile);
        });
    }

    // Select a tile
    function selectTile(event) {
        const clickedTile = event.target;
        clickedTile.classList.toggle('selected');

        const emoji = clickedTile.textContent;
        if (selectedEmojis.includes(emoji)) {
            selectedEmojis = selectedEmojis.filter(e => e !== emoji);
        } else {
            selectedEmojis.push(emoji);
        }
    }

    // Check if selected emojis match any recipe
    function checkRecipe() {
        const sortedSelectedEmojis = selectedEmojis.sort().join('');
        let recipeFound = false;

        recipes.forEach(recipe => {
            const sortedRecipeIngredients = recipe.ingredients.sort().join('');
            if (sortedSelectedEmojis === sortedRecipeIngredients) {
                recipeFound = true;
                showMessage(`Recipe found: ${recipe.result}`);
                if (!foundRecipeIcons.includes(recipe.result)) {
                    addRecipeToList(recipe.result, recipe.name);
                    foundRecipes++;
                    updateCounter();
                    if (foundRecipes === 10) {
                        showCongrats();
                    }
                }
            }
        });

        if (!recipeFound && sortedSelectedEmojis.length > 0) {
            showMessage('No recipe found. Try again!');
        }

        // Clear selections after checking
        clearSelection();
    }

    // Show congratulations message
    function showCongrats() {
        const congratsDiv = document.getElementById('congrats');
        congratsDiv.style.opacity = 1;  // Make the congrats message visible
    }

    // Update the message
    function showMessage(message) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = message;
        messageDiv.style.opacity = 1;
        setTimeout(() => {
            messageDiv.style.opacity = 0;
        }, 2000);
    }

    // Add recipe card to the found recipes list
    function addRecipeToList(recipeEmoji, recipeName) {
        const foundRecipesDiv = document.getElementById('found-recipes');
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <span class="emoji">${recipeEmoji}</span>
            <span class="name">${recipeName}</span>
        `;
        foundRecipesDiv.appendChild(recipeCard);
        setTimeout(() => {
            recipeCard.classList.add('show');
        }, 100);
        foundRecipeIcons.push(recipeEmoji);
    }

    // Update the counter for found recipes
    function updateCounter() {
        const counter = document.getElementById('counter');
        counter.textContent = `Recipes Found: ${foundRecipes}/10`;
    }

    // Clear selected tiles
    function clearSelection() {
        selectedEmojis = [];
        document.querySelectorAll('.tile.selected').forEach(tile => {
            tile.classList.remove('selected');
        });
    }

    // Combine button event
    document.getElementById('combine-button').addEventListener('click', checkRecipe);

    // Initialize the game
    createBoard();
</script>

</body>
</html>
```

### Explanation:

1. HTML Structure:
    - The game is wrapped in a container div for centered layout.
    - It includes a title, message area, game board, combine button, congratulatory message, counter, and found recipes section.

2. CSS Styling:
    - The layout is centered using flexbox.
    - The game board is created using CSS Grid.
    - Tiles have hover and selection effects.
    - Recipe cards are styled for a clean look.
    - Animations are added for smoother user experience.

3. JavaScript Functionality:
    - Recipes and emojis are defined as arrays.
    - The `createBoard()` function generates the 5x5 grid of emoji tiles.
    - `selectTile()` handles tile selection and highlighting.
    - `checkRecipe()` compares selected emojis to recipes when the combine button is clicked.
    - `showMessage()` displays feedback for found or not found recipes.
    - `addRecipeToList()` adds discovered recipes to the UI.
    - `updateCounter()` keeps track of found recipes.
    - `showCongrats()` displays the congratulatory message when all recipes are found.

4. Game Flow:
    - Players click on emoji tiles to select ingredients.
    - Clicking the "Combine" button checks for a valid recipe.
    - Feedback is shown for found or not found recipes.
    - Found recipes are displayed below the grid.
    - The counter is updated as recipes are discovered.
    - A congratulatory message appears when all recipes are found.

The code effectively implements an engaging recipe combination game called "Emoji Recipes".