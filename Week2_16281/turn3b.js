class Coffee {
    constructor(name) {
        this.name = name;
    }

    // Common method for all coffees
    prepare() {
        return `Preparing ${this.name}`;
    }
}

class Americano extends Coffee {
    constructor() {
        super("Americano");
    }

    // Specific preparation for Americano
    prepare() {
        return `${super.prepare()} by adding hot water to espresso.`;
    }
}

class Espresso extends Coffee {
    constructor() {
        super("Espresso");
    }

    // Espresso might not need any additional preparation steps for this example
}

class Cappuccino extends Coffee {
    constructor() {
        super("Cappuccino");
    }

    prepare() {
        return `${super.prepare()} with steamed milk foam on top.`;
    }
}

class Latte extends Coffee {
    constructor() {
        super("Latte");
    }

    prepare() {
        return `${super.prepare()} with more steamed milk and a light foam layer.`;
    }
}

class Mocha extends Coffee {
    constructor() {
        super("Mocha");
    }

    prepare() {
        return `${super.prepare()} with chocolate, steamed milk, and foam.`;
    }
}

class Affogato extends Coffee {
    constructor() {
        super("Affogato");
    }

    prepare() {
        return `${super.prepare()} served with a scoop of vanilla ice cream.`;
    }
}

class CoffeeFactory {
    static createCoffee(type) {
        switch (type.toLowerCase()) {
            case "americano":
                return new Americano();
            case "espresso":
                return new Espresso();
            case "cappuccino":
                return new Cappuccino();
            case "latte":
                return new Latte();
            case "mocha":
                return new Mocha();
            case "affogato":
                return new Affogato();
            default:
                throw new Error("Unknown coffee type");
        }
    }
}

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

    makeCoffee(type) {
        if (this.waterLevel > 0) {
            this.waterLevel--;
            const coffee = CoffeeFactory.createCoffee(type);
            console.log(coffee.prepare());
            this.#notifyObservers(
                "coffeeReady",
                `${coffee.name} is ready for pickup.`,
            );
            this.#notifyObservers(
                "prepareBill",
                `Please prepare the bill for ${coffee.name}.`,
            );
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
coffeeMachine.addObserver(new Waiter());
coffeeMachine.addObserver(new Cashier());

coffeeMachine.fillWater(10);
coffeeMachine.makeCoffee("Latte");
coffeeMachine.makeCoffee("Espresso");
