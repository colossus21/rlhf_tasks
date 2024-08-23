// Explain why a line is written, not just what it does
// Bad: Increment counter
counter++;

// Good: Increment counter to track number of failed login attempts
counter++;

// Keep comments concise and clear
// Bad: This function takes two numbers as parameters and returns their sum
function add(a, b) {
    return a + b;
}

// Good: Calculate sum of two numbers
function add(a, b) {
    return a + b;
}

// Use comments to explain complex logic
function isPrime(num) {
    if (num <= 1) return false;
    // Check up to the square root of num for efficiency
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Use JSDoc comments for functions
/**
 * Calculates the area of a circle
 * @param {number} radius - The radius of the circle
 * @returns {number} The area of the circle
 */
function calculateCircleArea(radius) {
    return Math.PI * radius * radius;
}

// Avoid commenting out code
// Bad:
// function oldFunction() {
//     // ...
// }
// Good: Remove unused code and use version control to track changes

// Use TODO comments for future tasks
function processData(data) {
    // TODO: Implement data validation
}

// Update comments when code changes
// Before:
// Calculate tax at 15%
let tax = price * 0.15;

// After (if tax rate changes):
// Calculate tax at 20%
let tax = price * 0.2;

// Use inline comments sparingly
// Unnecessary:
// Set user's age
user.age = 25;

// Better (no comment needed):
user.age = 25;

// Use comments to explain regex
// Match email addresses
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Comment on browser-specific hacks
// IE-specific fix for z-index bug
if (isIE) {
    element.style.zIndex = 1000;
}
