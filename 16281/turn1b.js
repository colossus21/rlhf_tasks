class CoffeeMachine {
    // Private static instance
    static #instance = null;

    constructor() {
        if (CoffeeMachine.#instance) {
            return CoffeeMachine.#instance;
        }
        this.waterLevel = 0;
        CoffeeMachine.#instance = this;
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

    // Static method to get or create the instance
    static getInstance() {
        if (!CoffeeMachine.#instance) {
            CoffeeMachine.#instance = new CoffeeMachine();
        }
        return CoffeeMachine.#instance;
    }
}

// Usage
const coffeeMachine1 = CoffeeMachine.getInstance();
const coffeeMachine2 = CoffeeMachine.getInstance();

coffeeMachine1.fillWater(5);
coffeeMachine2.makeCoffee();

console.log(coffeeMachine1 === coffeeMachine2); // Should print: true
