class CoffeeMachine {
    // Private static instance
    static #instance = null;

    // List of observers
    #observers = [];

    constructor() {
        if (CoffeeMachine.#instance) {
            return CoffeeMachine.#instance;
        }
        this.waterLevel = 0;
        CoffeeMachine.#instance = this;
    }

    // Method to add observers
    addObserver(observer) {
        this.#observers.push(observer);
    }

    // Method to notify all observers
    #notifyObservers(event, message) {
        this.#observers.forEach((observer) => observer.update(event, message));
    }

    fillWater(amount) {
        this.waterLevel += amount;
        console.log(`Water level is now ${this.waterLevel}`);
    }

    makeCoffee() {
        if (this.waterLevel > 0) {
            this.waterLevel--;
            console.log("Coffee made!");
            // Notifying that coffee is ready
            this.#notifyObservers("coffeeReady", "Coffee is ready for pickup.");
            // Notifying that bill needs to be prepared
            this.#notifyObservers(
                "prepareBill",
                "Please prepare the bill for coffee.",
            );
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

// Observer interface
class Observer {
    update(event, message) {
        throw new Error("This method should be implemented by subclasses");
    }
}

// Concrete observers
class Waiter extends Observer {
    update(event, message) {
        if (event === "coffeeReady") {
            console.log(`Waiter: ${message}`);
        }
    }
}

class Cashier extends Observer {
    update(event, message) {
        if (event === "prepareBill") {
            console.log(`Cashier: ${message}`);
        }
    }
}

// Usage
const coffeeMachine = CoffeeMachine.getInstance();

// Adding observers
coffeeMachine.addObserver(new Waiter());
coffeeMachine.addObserver(new Cashier());

coffeeMachine.fillWater(5);
coffeeMachine.makeCoffee();
