// Explain Why, Not What
// Avoid this:
let total = 0; // Initialize total to zero

// Do this:
let total = 0; // Reset total for new calculation

// Clarify Complex Logic
function fibonacci(n) {
    if (n <= 1) return n; // Base case for fibonacci sequence
    return fibonacci(n - 1) + fibonacci(n - 2); // Recursive case
}

// Document Non-obvious Parameters or Return Values
function parseDate(dateString) {
    // dateString expected in 'YYYY-MM-DD' format
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // Month is 0-indexed in Date constructor
}

// Explain Workarounds or Hacks
// Force repaint to fix layout bug in older WebKit browsers
element.style.display = "none";
element.offsetHeight; // No need to store this anywhere, it just triggers a reflow
element.style.display = "";

// Mark TODOs and Future Enhancements
function calculateArea(shape) {
    // TODO: Implement calculation for 'ellipse' and 'triangle'
    if (shape.type === "rectangle") {
        return shape.width * shape.height;
    }
    return 0; // Temporary placeholder for unsupported shapes
}

// Keep Comments Updated
// Initially:
let cache = {}; // Store API responses

// Updated after refactoring:
let cache = new Map(); // Using Map for better performance with large datasets

// Avoid Redundant Comments
// Not necessary:
i++; // Increment i by one

// Better:
i++; // Move to the next item in the array

// Use Comments for JSDoc
/**
 * Calculates the sum of two numbers.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum of a and b.
 */
function sum(a, b) {
    return a + b;
}
