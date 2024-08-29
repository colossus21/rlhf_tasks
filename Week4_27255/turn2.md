### Plan

1. **Displaying Recipes**: We display the recipes above the game container with the requirements and points for each recipe.
2. **Dice Roll Rewards**: Based on the dice roll, players receive different rewards:
    - 1: 1 Sugar
    - 2: 1 Milk
    - 3: 1 Espresso
    - 4: 2 Sugars
    - 5: 2 Milks
    - 6: 3 Espresso
3. **Purchasing Recipes**: Players can see which recipes they can purchase during their turn. Each recipe will grant the player some points required to win the game.

### Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Coffee Mix</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .card {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        .recipe-card {
            border: 2px solid #e5e7eb;
            padding: 10px;
            margin: 5px;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body class="bg-gray-100 p-4">

<div class="container mx-auto max-w-5xl bg-white p-8 rounded-lg shadow-lg">
    <h1 class="text-4xl text-center mb-4 font-bold text-gray-800">Coffee Mix</h1>

    <!-- Recipes Display -->
    <div class="bg-gray-50 p-6 rounded-lg shadow-md mb-4">
        <h2 class="text-2xl mb-4 font-semibold text-gray-700">Available Recipes</h2>
        <ul class="list-disc list-inside text-gray-600">
            <li><strong>Double Shot Espresso:</strong> 2 Espresso (3 points)</li>
            <li><strong>Triple Shot Espresso:</strong> 3 Espresso (5 points)</li>
            <li><strong>Milk Latte:</strong> 1 Sugar, 1 Milk, 1 Espresso (5 points)</li>
            <li><strong>Milk Shake:</strong> 2 Milk (2 points)</li>
            <li><strong>Candy:</strong> 1 Sugar (1 point)</li>
            <li><strong>Cappuccino:</strong> 1 Espresso, 1 Milk, 2 Sugar (7 points)</li>
        </ul>
        <p class="font-semibold text-gray-800 mt-4">Player who reaches 21 points first will win the game!</p>
    </div>

    <!-- Game Messages -->
    <div id="gameMessage" class="bg-blue-100 text-blue-800 p-4 rounded-lg mb-4 text-center font-semibold">
        Player 1, your turn.
    </div>

    <div class="grid grid-cols-3 gap-4 mb-4" id="recipes">
        <!-- Recipes will be dynamically added here -->
    </div>

    <div class="flex justify-center">
        <!-- Player 1 -->
        <div class="mr-8">
            <h3 class="text-xl text-center mb-2 font-bold text-gray-700">Player 1</h3>
            <div class="flex space-x-2 justify-center" id="player1">
                <div class="card bg-yellow-500 text-white" id="p1Sugar">0</div>
                <div class="card bg-blue-500 text-white" id="p1Milk">0</div>
                <div class="card bg-gray-800 text-white" id="p1Espresso">0</div>
            </div>
            <p class="mt-2 text-center text-gray-700">Points: <span id="p1Points">0</span></p>
        </div>

        <!-- Dice and Controls -->
        <div class="self-center text-center">
            <div id="dice" class="w-16 h-16 border-2 border-black flex items-center justify-center text-2xl mx-auto">1</div>
            <button id="rollDice" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Roll</button>
            <button id="endTurn" class="mt-2 bg-green-500 text-white py-2 px-4 rounded">End Turn</button>
        </div>

        <!-- Player 2 -->
        <div class="ml-8">
            <h3 class="text-xl text-center mb-2 font-bold text-gray-700">Player 2</h3>
            <div class="flex space-x-2 justify-center" id="player2">
                <div class="card bg-yellow-500 text-white" id="p2Sugar">0</div>
                <div class="card bg-blue-500 text-white" id="p2Milk">0</div>
                <div class="card bg-gray-800 text-white" id="p2Espresso">0</div>
            </div>
            <p class="mt-2 text-center text-gray-700">Points: <span id="p2Points">0</span></p>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', (event) => {
        const recipes = [
            {name: "Double Shot Espresso", points: 3, espresso: 2, color: '#fef9ef'},
            {name: "Triple Shot Espresso", points: 5, espresso: 3, color: '#e0e7ff'},
            {name: "Milk Latte", points: 5, sugar: 1, milk: 1, espresso: 1, color: '#f3e8ff'},
            {name: "Milk Shake", points: 2, milk: 2, color: '#fef3c7'},
            {name: "Candy", points: 1, sugar: 1, color: '#e3f6f5'},
            {name: "Cappuccino", points: 7, sugar: 2, milk: 1, espresso: 1, color: '#fff7e6'}
        ];

        const diceRewards = {1: 'sugar', 2: 'milk', 3: 'espresso', 4: 'sugar', 5: 'milk', 6: 'espresso'};

        let currentPlayer = 1;
        let player1 = {sugar: 0, milk: 0, espresso: 0, points: 0};
        let player2 = {sugar: 0, milk: 0, espresso: 0, points: 0};
        let diceRolled = false;

        const updateGameMessage = (message) => {
            document.getElementById('gameMessage').textContent = message;
        };

        const updateRecipes = () => {
            const recipesDiv = document.getElementById('recipes');
            recipesDiv.innerHTML = '';
            const current = [player1, player2][currentPlayer - 1];
            current.canBuy = [];
            recipes.forEach(recipe => {
                const canBuy = Object.keys(recipe).every(key => {
                    if(key !== 'name' && key !== 'points' && key !== 'color') {
                        return current[key] >= recipe[key];
                    }
                    return true;
                });
                if (canBuy) {
                    current.canBuy.push(recipe);
                }
                let recipeDiv = document.createElement('div');
                recipeDiv.className = 'recipe-card';
                recipeDiv.style.backgroundColor = recipe.color;
                recipeDiv.innerHTML = `<b>${recipe.name}</b> (${recipe.points} points) - E:${recipe.espresso||0}, S:${recipe.sugar||0}, M:${recipe.milk||0}`;
                if (canBuy) {
                    recipeDiv.onclick = () => buyRecipe(recipe);
                    recipeDiv.classList.add('cursor-pointer', 'hover:bg-gray-200');
                }
                recipesDiv.appendChild(recipeDiv);
            });
        };

        const rollDice = () => {
            if (!diceRolled) {
                const roll = Math.floor(Math.random() * 6) + 1;
                document.getElementById('dice').textContent = roll;
                const reward = diceRewards[roll] || diceRewards[6];
                const currentPlayerData = [player1, player2][currentPlayer - 1];
                const rewardAmount = (roll === 6 ? 3 : (roll === 4 || roll === 5) ? 2 : 1);
                currentPlayerData[reward] += rewardAmount;
                updateGameMessage(`Player ${currentPlayer}, you received ${rewardAmount} ${reward.charAt(0).toUpperCase() + reward.slice(1)}${rewardAmount > 1 ? 's' : ''}`);
                updatePlayerDisplay();
                updateRecipes();
                diceRolled = true;
            } else {
                updateGameMessage(`Player ${currentPlayer}, you've already rolled the dice this turn.`);
            }
        };

        const buyRecipe = (recipe) => {
            if (diceRolled && confirm(`Buy ${recipe.name} for ${recipe.points} points?`)) {
                const currentPlayerData = [player1, player2][currentPlayer - 1];
                Object.keys(recipe).forEach(key => {
                    if(key !== 'name' && key !== 'points' && key !== 'color') currentPlayerData[key] -= recipe[key];
                });
                currentPlayerData.points += recipe.points;
                updateGameMessage(`You bought ${recipe.name}, you receive ${recipe.points} points`);
                updatePlayerDisplay();
                updateRecipes();
                checkWin();
            }
        };

        const updatePlayerDisplay = () => {
            const current = [player1, player2][currentPlayer - 1];
            document.getElementById(`p${currentPlayer}Sugar`).textContent = current.sugar;
            document.getElementById(`p${currentPlayer}Milk`).textContent = current.milk;
            document.getElementById(`p${currentPlayer}Espresso`).textContent = current.espresso;
            document.getElementById(`p${currentPlayer}Points`).textContent = current.points;
        };

        const endTurn = () => {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateGameMessage(`Player ${currentPlayer}, your turn.`);
            diceRolled = false;
            updateRecipes();
        };

        const checkWin = () => {
            if ([player1, player2][currentPlayer - 1].points >= 21) {
                alert(`Player ${currentPlayer} wins!`);
            }
        };

        document.getElementById('rollDice').addEventListener('click', rollDice);
        document.getElementById('endTurn').addEventListener('click', endTurn);
        updateRecipes();
    });
</script>

</body>
</html>
```

With the following changes, the player should be able to play the game according to the rules you mentioned. The player who reaches 21 points by buying recipes will win the game. The interface has been enhanced using TailwindCSS for a cleaner and more modern look. This code is self-contained and can be run directly in an HTML file.