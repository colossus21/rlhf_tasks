const Decimal = require('decimal.js');

function radioactiveDecay(N0, lambda, t) {
    const N0Dec = new Decimal(N0);
    const lambdaDec = new Decimal(lambda);
    const tDec = new Decimal(t);
    return N0Dec.times(Decimal.exp(lambdaDec.times(tDec).negated()));
}

const N0 = 1000;
const lambda = 0.0001;
const timePeriods = [1, 10, 100, 1000, 10000, 100000];

timePeriods.forEach(t => {
    const remainingQuantity = radioactiveDecay(N0, lambda, t);
    console.log(`At time t = ${t}, remaining quantity: ${remainingQuantity.toFixed(20)}`);
});