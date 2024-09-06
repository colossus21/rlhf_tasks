// Abstract Coffee class
class Coffee {
    constructor(name) {
        this.name = name;
    }

    prepare() {
        throw new Error("This method should be implemented by subclasses");
    }
}

// Concrete Coffee classes
class Americano extends Coffee {
    constructor() {
        super("Americano");
    }

    prepare() {
        return `Preparing ${this.name}: Espresso shot with hot water`;
    }
}

class Espresso extends Coffee {
    constructor() {
        super("Espresso");
    }

    prepare() {
        return `Preparing ${this.name}: Single shot of espresso`;
    }
}

class Cappuccino extends Coffee {
    constructor() {
        super("Cappuccino");
    }

    prepare() {
        return `Preparing ${this.name}: Espresso with steamed milk and foam`;
    }
}

class Latte extends Coffee {
    constructor() {
        super("Latte");
    }

    prepare() {
        return `Preparing ${this.name}: Espresso with steamed milk`;
    }
}

class Mocha extends Coffee {
    constructor() {
        super("Mocha");
    }

    prepare() {
        return `Preparing ${this.name}: Espresso with chocolate and steamed milk`;
    }
}

class Affogato extends Coffee {
    constructor() {
        super("Affogato");
    }

    prepare() {
        return `Preparing ${this.name}: Espresso poured over a scoop of vanilla ice cream`;
    }
}

// CoffeeMachine class (Singleton + Factory + Observer)
class CoffeeMachine {
    static #instance = null;
    #observers = [];
    #waterLevel = 0;

    constructor() {
        if (CoffeeMachine.#instance) {
            return CoffeeMachine.#instance;
        }
        CoffeeMachine.#instance = this;
    }

    addObserver(observer) {
        this.#observers.push(observer);
    }

    #notifyObservers(event, message) {
        this.#observers.forEach((observer) => observer.update(event, message));
    }

    fillWater(amount) {
        this.#waterLevel += amount;
        console.log(`Water level is now ${this.#waterLevel}`);
    }

    makeCoffee(type) {
        if (this.#waterLevel <= 0) {
            console.log("Please add water!");
            return;
        }

        let coffee;
        switch (type.toLowerCase()) {
            case "americano":
                coffee = new Americano();
                break;
            case "espresso":
                coffee = new Espresso();
                break;
            case "cappuccino":
                coffee = new Cappuccino();
                break;
            case "latte":
                coffee = new Latte();
                break;
            case "mocha":
                coffee = new Mocha();
                break;
            case "affogato":
                coffee = new Affogato();
                break;
            default:
                throw new Error("Unknown coffee type");
        }

        console.log(coffee.prepare());
        this.#waterLevel--;
        this.#notifyObservers(
            "coffeeReady",
            `${coffee.name} is ready for pickup.`,
        );
        this.#notifyObservers(
            "prepareBill",
            `Please prepare the bill for ${coffee.name}.`,
        );
    }

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

coffeeMachine.addObserver(new Waiter());
coffeeMachine.addObserver(new Cashier());

coffeeMachine.fillWater(5);
coffeeMachine.makeCoffee("Espresso");
coffeeMachine.makeCoffee("Latte");
coffeeMachine.makeCoffee("Affogato");
