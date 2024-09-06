class CoffeeMachine {
    constructor() {
        if (CoffeeMachine.instance) {
            return CoffeeMachine.instance;
        }
        this.waterLevel = 0; // example property
        CoffeeMachine.instance = this;
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
        if (!CoffeeMachine.instance) {
            CoffeeMachine.instance = new CoffeeMachine();
        }
        return CoffeeMachine.instance;
    }
}

const coffeeMachine1 = CoffeeMachine.getInstance();
const coffeeMachine2 = CoffeeMachine.getInstance();

coffeeMachine1.fillWater(5);
coffeeMachine2.makeCoffee();

console.log(coffeeMachine1 === coffeeMachine2);
