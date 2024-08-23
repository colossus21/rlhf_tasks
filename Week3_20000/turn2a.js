const Benchmark = require('benchmark');
const Decimal = require('decimal.js');
const BigNumber = require('bignumber.js');

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
    return bN0.times(bLambda.times(bt).negated().exp());
}

// Constants
const N0 = 1000;
const lambda = 0.0001;
const t = 100000;

// Prepare test data
let nativeResults = [];
let decimalResults = [];
let bigNumberResults = [];

// Benchmark setup
const suite = new Benchmark.Suite;

suite
    .add('Native JavaScript', function() {
        for (let i = 0; i < 1000; i++) {
            nativeResults.push(radioactiveDecayNative(N0, lambda, t));
        }
    })
    .add('Decimal.js', function() {
        for (let i = 0; i < 1000; i++) {
            decimalResults.push(radioactiveDecayDecimal(N0, lambda, t).toString());
        }
    })
    .add('BigNumber.js', function() {
        for (let i = 0; i < 1000; i++) {
            bigNumberResults.push(radioactiveDecayBigNumber(N0, lambda, t).toString());
        }
    })
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').map('name'));

        // Check for accuracy by comparing results (simplified approach)
        const nativeAvg = nativeResults.reduce((a, b) => a + b, 0) / nativeResults.length;
        const decimalAvg = decimalResults.reduce((a, b) => new Decimal(a).plus(b), new Decimal(0)).dividedBy(decimalResults.length);
        const bigNumberAvg = bigNumberResults.reduce((a, b) => new BigNumber(a).plus(b), new BigNumber(0)).dividedBy(bigNumberResults.length);

        console.log('Accuracy check (average result):');
        console.log('Native JavaScript: ', nativeAvg);
        console.log('Decimal.js: ', decimalAvg.toString());
        console.log('BigNumber.js: ', bigNumberAvg.toString());
    })
    .run({ 'async': true });
