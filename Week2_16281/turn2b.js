// Observer interface (in JavaScript, we'll use a class)
class Observer {
    update(message) {
        throw new Error("Method 'update()' must be implemented.");
    }
}

// Concrete Observer: Waiter
class Waiter extends Observer {
    update(message) {
        console.log(`Waiter notified: ${message}`);
    }
}

// Concrete Observer: Cashier
class Cashier extends Observer {
    update(message) {
        console.log(`Cashier notified: ${message}`);
    }
}

// Subject (Observable)
class CoffeeMachine {
    static #instance = null;
    #observers = [];

    constructor() {
        if (CoffeeMachine.#instance) {
            return CoffeeMachine.#instance;
        }
        this.waterLevel = 0;
        CoffeeMachine.#instance = this;
    }

    addObserver(observer) {
        this.#observers.push(observer);
    }

    removeObserver(observer) {
        const index = this.#observers.indexOf(observer);
        if (index > -1) {
            this.#observers.splice(index, 1);
        }
    }

    notifyObservers(message) {
        for (let observer of this.#observers) {
            observer.update(message);
        }
    }

    fillWater(amount) {
        this.waterLevel += amount;
        console.log(`Water level is now ${this.waterLevel}`);
    }

    makeCoffee() {
        if (this.waterLevel > 0) {
            this.waterLevel--;
            console.log("Coffee made!");
            this.notifyObservers("Coffee order is ready");
        } else {
            console.log("Please add water!");
        }
    }

    static getInstance() {
        if (!CoffeeMachine.#instance) {
            CoffeeMachine.#instance = new CoffeeMachine();
        }
        return CoffeeMachine.#instance;
    }
}

// Usage
const coffeeMachine = CoffeeMachine.getInstance();
const waiter = new Waiter();
const cashier = new Cashier();

coffeeMachine.addObserver(waiter);
coffeeMachine.addObserver(cashier);

coffeeMachine.fillWater(5);
coffeeMachine.makeCoffee();
