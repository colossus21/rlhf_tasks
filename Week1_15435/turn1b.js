// This function calculates the factorial of a given number n
function factorial(n) {
    // Base case: if n is 0, the factorial is 1
    if (n === 0) {
        return 1;
    }
    // Recursive case: calculate the factorial of n by multiplying n with the factorial of (n - 1)
    return n * factorial(n - 1);
}
