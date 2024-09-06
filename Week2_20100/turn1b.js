// News Publisher (Subject)
class NewsPublisher {
    constructor() {
        this.subscribers = [];
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    unsubscribe(subscriber) {
        this.subscribers = this.subscribers.filter(s => s !== subscriber);
    }

    broadcast(news) {
        for (let subscriber of this.subscribers) {
            subscriber.receiveNews(news);
        }
    }
}

// Subscriber interface
class NewsSubscriber {
    constructor(name) {
        this.name = name;
    }

    receiveNews(news) {
        console.log(`${this.name} received news: ${news}`);
    }
}

// Concrete Subscribers
class MobilePhone extends NewsSubscriber {
    constructor(phoneNumber) {
        super(`Mobile Phone (${phoneNumber})`);
    }
}

class TV extends NewsSubscriber {
    constructor(brand) {
        super(`TV (${brand})`);
    }
}

class Laptop extends NewsSubscriber {
    constructor(owner) {
        super(`Laptop (${owner})`);
    }
}

// Usage
const newsPublisher = new NewsPublisher();

const phone1 = new MobilePhone("123-456-7890");
const phone2 = new MobilePhone("987-654-3210");
const tv1 = new TV("Samsung");
const laptop1 = new Laptop("Alice");

newsPublisher.subscribe(phone1);
newsPublisher.subscribe(phone2);
newsPublisher.subscribe(tv1);
newsPublisher.subscribe(laptop1);

newsPublisher.broadcast("Breaking news: JavaScript is awesome!");

// Unsubscribe phone2
newsPublisher.unsubscribe(phone2);

newsPublisher.broadcast("Another news: Observer pattern implemented successfully!");