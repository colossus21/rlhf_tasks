### Updated Plan:

1. **UI**:
    - A container should contain the title, six buttons (1 for each algorithm) and the simulator itself.
    - A slider should be added below the buttons to control the speed of the simulation.

2. **p5.js**:
    - A draw function would be used to visualize these bars as rectangles of varying heights. We should have implementations of all the algorithms mentioned.
    - We also keep track of the element which are sorted using a different color.

### Updated Implementation:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sorting Algorithm Visualizer</title>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex items-center justify-center min-h-screen">

<div class="max-w-4xl w-full text-center p-8 bg-white rounded-3xl shadow-2xl">
    <h1 class="text-5xl font-extrabold mb-8 text-gray-900">Sorting Algorithm Visualizer</h1>

    <!-- Buttons for each sorting algorithm -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        <button id="selectionSort" class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">Selection Sort</button>
        <button id="bubbleSort" class="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">Bubble Sort</button>
        <button id="insertionSort" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">Insertion Sort</button>
        <button id="mergeSort" class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">Merge Sort</button>
        <button id="quickSort" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">Quick Sort</button>
        <button id="heapSort" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">Heap Sort</button>
    </div>

    <!-- Speed control slider -->
    <div class="flex justify-center items-center space-x-4 mb-8">
        <label for="speed" class="text-lg text-gray-900 font-semibold">Sorting Speed:</label>
        <input id="speedSlider" type="range" min="1" max="100" value="50" class="w-full slider">
    </div>

    <!-- Canvas container for the sorting visualization -->
    <div id="sketch-holder" class="w-full flex justify-center bg-gray-200 rounded-lg p-4 shadow-inner"></div>

    <!-- Time and Space Complexity Information -->
    <div id="complexity-info" class="mt-8 text-gray-800">
        <h2 class="text-2xl font-bold mb-4">Complexity Information</h2>
        <div id="complexity-details" class="text-left text-lg">
            <!-- Complexity details will be injected here dynamically -->
        </div>
    </div>
</div>

<script>
    let values = []; // Array to hold the values to be sorted
    let w = 12; // Width of each bar in the visualization
    let delay = 50; // Initial delay for sorting speed
    let states = []; // Array to hold the states of each bar for coloring
    let sortingAlgorithm = ''; // Variable to keep track of the selected sorting algorithm

    const complexities = {
        selection: {
            best: "O(n^2)",
            worst: "O(n^2)",
            space: "O(1)"
        },
        bubble: {
            best: "O(n)",
            worst: "O(n^2)",
            space: "O(1)"
        },
        insertion: {
            best: "O(n)",
            worst: "O(n^2)",
            space: "O(1)"
        },
        merge: {
            best: "O(n log n)",
            worst: "O(n log n)",
            space: "O(n)"
        },
        quick: {
            best: "O(n log n)",
            worst: "O(n^2)",
            space: "O(log n)"
        },
        heap: {
            best: "O(n log n)",
            worst: "O(n log n)",
            space: "O(1)"
        }
    };

    // Setup function to initialize the canvas and event listeners
    function setup() {
        let canvas = createCanvas(720, 300);
        canvas.parent('sketch-holder');
        resetArray();

        // Event listeners for sorting algorithm buttons
        document.getElementById('selectionSort').onclick = () => { startSorting('selection'); };
        document.getElementById('bubbleSort').onclick = () => { startSorting('bubble'); };
        document.getElementById('insertionSort').onclick = () => { startSorting('insertion'); };
        document.getElementById('mergeSort').onclick = () => { startSorting('merge'); };
        document.getElementById('quickSort').onclick = () => { startSorting('quick'); };
        document.getElementById('heapSort').onclick = () => { startSorting('heap'); };

        // Event listener for the speed slider
        document.getElementById('speedSlider').oninput = function() {
            delay = 105 - this.value;  // Adjust delay based on slider value
        }
    }

    // Function to reset the array with random values
    function resetArray() {
        values = new Array(floor(width / w));
        for (let i = 0; i < values.length; i++) {
            values[i] = random(1, 250); // Values between 1 and 250
            states[i] = -1;
        }
    }

    // Draw function to render the bars on the canvas
    function draw() {
        background(255);
        for (let i = 0; i < values.length; i++) {
            stroke(0);
            if (states[i] == 0) {
                fill('#FF6F61');  // Color for current elements being compared
            } else if (states[i] == 1) {
                fill('#6B5B95');  // Color for sorted elements
            } else {
                fill('#88B04B');  // Default color for bars
            }
            rect(i * w, height - values[i], w, values[i]);
        }
    }

    // Function to start the sorting based on selected algorithm
    async function startSorting(algo) {
        resetArray();
        sortingAlgorithm = algo;
        updateComplexityInfo(algo);
        switch(algo) {
            case 'selection':
                await selectionSort(values);
                break;
            case 'bubble':
                await bubbleSort(values);
                break;
            case 'insertion':
                await insertionSort(values);
                break;
            case 'merge':
                await mergeSort(values, 0, values.length - 1);
                break;
            case 'quick':
                await quickSort(values, 0, values.length - 1);
                break;
            case 'heap':
                await heapSort(values);
                break;
        }
    }

    // Selection Sort implementation
    async function selectionSort(arr) {
        for (let i = 0; i < arr.length; i++) {
            let minIdx = i;
            states[i] = 0; // Mark the element as being compared
            for (let j = i + 1; j < arr.length; j++) {
                states[j] = 0; // Mark the element as being compared
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
                await sleep(delay);
                states[j] = -1; // Reset the state after comparison
            }
            await swap(arr, i, minIdx);
            states[i] = 1; // Mark the element as sorted
        }
    }

    // Bubble Sort implementation
    async function bubbleSort(arr) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                states[j] = 0; // Mark the element as being compared
                states[j + 1] = 0; // Mark the next element as being compared
                if (arr[j] > arr[j + 1]) {
                    await swap(arr, j, j + 1);
                }
                await sleep(delay);
                states[j] = -1; // Reset the state after comparison
                states[j + 1] = -1; // Reset the state after comparison
            }
            states[arr.length - i - 1] = 1; // Mark the element as sorted
        }
    }

    // Insertion Sort implementation
    async function insertionSort(arr) {
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            states[i] = 0; // Mark the element as being compared
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
                await sleep(delay);
            }
            arr[j + 1] = key;
            states[j + 1] = 1; // Mark the element as sorted
        }
    }

    // Merge Sort implementation
    async function mergeSort(arr, l, r) {
        if (l >= r) {
            return;
        }
        const m = l + floor((r - l) / 2);
        await mergeSort(arr, l, m);
        await mergeSort(arr, m + 1, r);
        await merge(arr, l, m, r);
    }

    // Merge function for Merge Sort
    async function merge(arr, l, m, r) {
        let n1 = m - l + 1;
        let n2 = r - m;
        let L = new Array(n1);
        let R = new Array(n2);

        for (let i = 0; i < n1; i++)
            L[i] = arr[l + i];
        for (let j = 0; j < n2; j++)
            R[j] = arr[m + 1 + j];

        let i = 0, j = 0, k = l;

        while (i < n1 && j < n2) {
            states[k] = 0; // Mark the element as being compared
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
            await sleep(delay);
        }

        while (i < n1) {
            states[k] = 0; // Mark the element as being compared
            arr[k] = L[i];
            i++;
            k++;
            await sleep(delay);
        }

        while (j < n2) {
            states[k] = 0; // Mark the element as being compared
            arr[k] = R[j];
            j++;
            k++;
            await sleep(delay);
        }

        for (let i = l; i <= r; i++) {
            states[i] = 1; // Mark the element as sorted
        }
    }

    // Quick Sort implementation
    async function quickSort(arr, l, r) {
        if (l < r) {
            let pi = await partition(arr, l, r);
            await quickSort(arr, l, pi - 1);
            await quickSort(arr, pi + 1, r);
        }
    }

    // Partition function for Quick Sort
    async function partition(arr, l, r) {
        let pivot = arr[r];
        states[r] = 0; // Mark the pivot as being compared
        let i = l - 1;
        for (let j = l; j < r; j++) {
            states[j] = 0; // Mark the element as being compared
            if (arr[j] < pivot) {
                i++;
                await swap(arr, i, j);
            }
            await sleep(delay);
            states[j] = -1; // Reset the state after comparison
        }
        await swap(arr, i + 1, r);
        states[i + 1] = 1; // Mark the pivot as sorted
        return i + 1;
    }

    // Heap Sort implementation
    async function heapSort(arr) {
        let n = arr.length;

        for (let i = floor(n / 2) - 1; i >= 0; i--) {
            await heapify(arr, n, i);
        }

        for (let i = n - 1; i > 0; i--) {
            await swap(arr, 0, i);
            states[i] = 1; // Mark the element as sorted
            await heapify(arr, i, 0);
        }
        states[0] = 1; // Mark the first element as sorted
    }

    // Heapify function for Heap Sort
    async function heapify(arr, n, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest != i) {
            await swap(arr, i, largest);
            await heapify(arr, n, largest);
        }
    }

    // Function to swap two elements in the array
    async function swap(arr, a, b) {
        await sleep(delay);
        let temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }

    // Function to pause the execution for a given time
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to update the complexity information
    function updateComplexityInfo(algo) {
        const info = complexities[algo];
        const complexityDetails = `
            <p><strong>Time Complexity:</strong></p>
            <ul>
                <li><strong>Best Case:</strong> ${info.best}</li>
                <li><strong>Worst Case:</strong> ${info.worst}</li>
            </ul>
            <p><strong>Space Complexity:</strong> ${info.space}</p>
        `;
        document.getElementById('complexity-details').innerHTML = complexityDetails;
    }
</script>
</body>
</html>
```

### Explanation:

1. **Coloring the Bars**:
    - Bars which are being worked on are colored red.
    - Once an element is sorted, it changes to purple.

2. **Time and Space Complexity**:
    - Under the canvas, the time and space complexity for the selected sorting algorithm is displayed.
    - The complexity information includes both the Best Case and Worst Case scenarios.

These additions make the sorting visualizer more interactive by providing real-time complexity information.