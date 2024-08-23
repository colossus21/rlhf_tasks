// not part of the notebook
let a = 1;
let b = 2;
function storeResult(n) {
  return n;
}
function validateData(n) {
  return n;
}

// Unnecessary comment, the code is clear
let maxValue = 100; // Set the maximum value to 100

// Prefer this without the comment
maxValue = 100;

// Unnecessary comment, just repeating the code
let sum = a + b; // Add a and b and store in sum

// Prefer this without the comment
sum = a + b;

// Avoid putting comments in the middle of functions
function processData(data) {
  // Step 1: Validate the data
  if (!data.isValid) {
    return null;
  }
  // Process the data
  let result = process(data);
  // Step 2: Store the processed data
  storeResult(result);
  return result;
}

// Prefer breaking it into smaller functions
function validateData(data) {
  if (!data.isValid) {
    return null;
  }
  return data;
}

function processData(data) {
  let validatedData = validateData(data);
  if (validatedData === null) {
    return null;
  }
  let result = process(validatedData);
  storeResult(result);
  return result;
}

/**
 * Calculates the factorial of a given integer.
 *
 * @param {number} n The number to calculate the factorial of.
 * @returns {number} The factorial of n.
 */
function factorial(n) {
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
}

// This is a bad idea, better refactor the code
// This function is a hack, it's not doing what it's supposed to do
function badFunction() {
  // ...
}

// Prefer refactoring the code to make it clear and correct
function correctFunction() {
  // ...
}
