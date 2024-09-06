// Explain why a line is written
let attempts = 0;
// Increment attempts to track number of failed login attempts
attempts++;
console.log("Login attempts: " + attempts);

// Keep comments informative
// Calculate sum of two numbers
function add(a, b) {
    return a + b;
}
console.log("Sum of 3 and 4 is: " + add(3, 4));

// Comment to explain complex logic
function isPrime(num) {
    if (num <= 1) return false;
    // Only check up to the square root of num for efficiency
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}
console.log("Is 29 prime? " + isPrime(29));

// Avoid commenting out code
// Instead of commenting out unused code:
// let isVisible = false;
// function toggle() {
//     isVisible = !isVisible;
// }
// toggle();
// Use version control systems to track changes and remove unused code.

// Use TODO comments for future tasks
function processData(data) {
    // TODO: Implement data validation
    console.log("Processing data: ", data);
}
processData({ name: "John Doe", age: 30 });

// Update comments when code changes
let price = 100;
let tax = price * 0.2; // Calculate tax at 20%
console.log("Tax for $100: $" + tax);

// Avoid comments when the code is clear
let user = { name: "John", age: 23 };
user.age = 25; // Set user's age (Bad)

// Workaround for deprecated unhandled promise rejection warning in Node.js
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Use comments to explain regex
// Match email addresses
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
console.log("Valid email:", emailRegex.test("example@example.com"));
