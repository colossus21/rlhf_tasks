class CoffeeMachine {
    constructor() {
        if (!CoffeeMachine.instance) {
            this.waterLevel = 0; // example property
            CoffeeMachine.instance = this;
        }
        return CoffeeMachine.instance;
    }

    fillWater(amount) {
        this.waterLevel += amount;
        console.log(`Water level is now ${this.waterLevel}`);
    }

    makeCoffee() {
        if (this.waterLevel > 0) {
            this.waterLevel--;
            console.log("Coffee made!");
        } else {
            console.log("Please add water!");
        }
    }

    static getInstance() {
        return new CoffeeMachine();
    }
}

// Usage
const coffeeMachine1 = new CoffeeMachine();
const coffeeMachine2 = CoffeeMachine.getInstance();

coffeeMachine1.fillWater(5);
coffeeMachine2.makeCoffee();

console.log(coffeeMachine1 === coffeeMachine2);
