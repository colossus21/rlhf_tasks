const Decimal = require('decimal.js');

function radioactiveDecay(N0, lambda, t) {
    // Convert to Decimal for precise calculation
    const dN0 = new Decimal(N0);
    const dLambda = new Decimal(lambda);
    const dt = new Decimal(t);

    // Perform the exponential calculation with Decimal
    return dN0.mul(dLambda.mul(dt).negated().exp());
}

const N0 = 1000;
const lambda = 0.0001;
const timePeriods = [1, 10, 100, 1000, 10000, 100000];

timePeriods.forEach(t => {
    const remainingQuantity = radioactiveDecay(N0, lambda, t);
    console.log(`At time t = ${t}, remaining quantity: ${remainingQuantity.toString()}`);
});