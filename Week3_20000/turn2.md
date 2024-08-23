To ensure you're selecting the right library for your radioactive decay simulation, I've prepared a benchmark script that considers both performance and accuracy using the `Decimal.js`, `BigNumber.js` and native JavaScript implementation.

Before running the benchmark script, install the necessary Node.js packages by running the following command in your terminal:

```bash
npm install benchmark decimal.js bignumber.js
```

Here's a complete code to the implementation:

```javascript
const Benchmark = require('benchmark');
const Decimal = require('decimal.js');
const BigNumber = require('bignumber.js');

// Load reference values from a precomputed source (e.g., from Python's NumPy)
const referenceValues = {
   "1": 999.9000049998333,
   "10": 999.000499833375,
   "100": 990.0498337491681,
   "1000": 904.8374180359596,
   "10000": 367.87944117144235,
   "100000": 0.04539992976248485
};

// Native JavaScript function
function radioactiveDecayNative(N0, lambda, t) {
   return N0 * Math.exp(-lambda * t);
}

// Decimal.js function
function radioactiveDecayDecimal(N0, lambda, t) {
   const dN0 = new Decimal(N0);
   const dLambda = new Decimal(lambda);
   const dt = new Decimal(t);
   return dN0.mul(dLambda.mul(dt).neg().exp());
}

// BigNumber.js function
function radioactiveDecayBigNumber(N0, lambda, t) {
   // To handle very large numbers
   BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
   const bN0 = new BigNumber(N0);
   const bLambda = new BigNumber(lambda);
   const bt = new BigNumber(t);

   const exponent = bLambda.times(bt).negated().toNumber();
   const expResult = new BigNumber(Math.exp(exponent));
   return bN0.times(expResult);
}

// Constants
const N0 = 1000;
const lambda = 0.0001;

// Benchmark setup
const suite = new Benchmark.Suite;

suite
        .add('Native JavaScript', function() {
           let result;
           for (let i = 0; i < 1000; i++) {
              result = radioactiveDecayNative(N0, lambda, 100000);
           }
           return result;
        })
        .add('Decimal.js', function() {
           let result;
           for (let i = 0; i < 1000; i++) {
              result = radioactiveDecayDecimal(N0, lambda, 100000);
           }
           return result;
        })
        .add('BigNumber.js', function() {
           let result;
           for (let i = 0; i < 1000; i++) {
              result = radioactiveDecayBigNumber(N0, lambda, 100000);
           }
           return result;
        })
        .on('cycle', function(event) {
           console.log(String(event.target));
        })
        .on('complete', function() {
           console.log('Fastest is ' + this.filter('fastest').map('name'));

           const timePeriods = Object.keys(referenceValues).map(Number);

           timePeriods.forEach(t => {
              const referenceValue = referenceValues[t];
              const nativeResult = radioactiveDecayNative(N0, lambda, t);
              const decimalResult = radioactiveDecayDecimal(N0, lambda, t);
              const bigNumberResult = radioactiveDecayBigNumber(N0, lambda, t);

              const relativeErrorNative = Math.abs((nativeResult - referenceValue) / referenceValue);
              const relativeErrorDecimal = Math.abs((decimalResult.toNumber() - referenceValue) / referenceValue);
              const relativeErrorBigNumber = Math.abs((bigNumberResult.toNumber() - referenceValue) / referenceValue);

              console.log(`Time t = ${t}:`);
              console.log('  Native JavaScript relative error: ', relativeErrorNative);
              console.log('  Decimal.js relative error: ', relativeErrorDecimal);
              console.log('  BigNumber.js relative error: ', relativeErrorBigNumber);
           });
        })
        .run({ 'async': true });
```

### Explanation:

1. **Performance Consideration**:
   - The script uses `Benchmark.Suite` to measure the performance of each implementation (native JavaScript, `Decimal.js`, and `BigNumber.js`). It runs 1,000 iterations for each library to simulate a real-world usage scenario in scientific computing.

2. **Accuracy Consideration**:
   - After benchmarking, the script compares the accuracy of each implementation against precomputed reference values (which might have been generated using a highly accurate tool like NumPy in Python).
   - The relative error for each library is calculated to give a clear picture of how close each result is to the reference value.
   - The script ensures that each function is executed 1,000 times, making it suitable for testing performance in a context similar to your intended simulation use case.


This benchmark script provides a comprehensive evaluation, ensuring that you select the best library for your simulation and scientific computing needs in JavaScript.