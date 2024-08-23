const Decimal = require('decimal.js');
const BigNumber = require('bignumber.js');

// Native JavaScript implementation
function nativeDecay(N0, lambda, t) {
    return N0 * Math.exp(-lambda * t);
}

// Decimal.js implementation
function decimalDecay(N0, lambda, t) {
    return new Decimal(N0).mul(Decimal.exp(new Decimal(-lambda).mul(t)));
}

// BigNumber.js implementation
function bigNumberDecay(N0, lambda, t) {
    return new BigNumber(N0).times(BigNumber.exp(new BigNumber(-lambda).times(t)));
}

// Benchmark function
function runBenchmark(decayFunc, name) {
    const N0 = 1000;
    const lambda = 0.0001;
    const timePeriods = [1, 10, 100, 1000, 10000, 100000];
    const iterations = 1000;

    console.log(`\nBenchmarking ${name}:`);

    const start = process.hrtime();

    for (let i = 0; i < iterations; i++) {
        timePeriods.forEach(t => {
            decayFunc(N0, lambda, t);
        });
    }

    const end = process.hrtime(start);
    const executionTime = end[0] * 1000 + end[1] / 1000000; // Convert to milliseconds

    console.log(`Execution time: ${executionTime.toFixed(2)} ms`);

    // Check accuracy for the largest time period
    const result = decayFunc(N0, lambda, timePeriods[timePeriods.length - 1]);
    console.log(`Result for t=${timePeriods[timePeriods.length - 1]}: ${result.toString()}`);
}

// Run benchmarks
runBenchmark(nativeDecay, "Native JavaScript");
runBenchmark(decimalDecay, "Decimal.js");
runBenchmark(bigNumberDecay, "BigNumber.js");

// Accuracy comparison for the largest time period
const t = 100000;
console.log("\nAccuracy Comparison for t =", t);
console.log("Native JavaScript:", nativeDecay(1000, 0.0001, t));
console.log("Decimal.js:", decimalDecay(1000, 0.0001, t).toString());
console.log("BigNumber.js:", bigNumberDecay(1000, 0.0001, t).toString());