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
    BigNumber.config({ EXPONENTIAL_AT: 1e+9 }); // To handle very large numbers
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
