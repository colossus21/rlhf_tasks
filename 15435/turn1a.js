// Define a function named factorial that takes one argument, n.
function factorial(n) {
    // Base case: if n is 0, the factorial is defined to be 1.
    if (n === 0) {
        return 1;
    }
    // Recursive case: calculate the factorial by multiplying n with the factorial of (n - 1).
    return n * factorial(n - 1);
}
