class NewsPublisher {
    constructor() {
        this.subscribers = [];
    }

    // Add a new subscriber
    subscribe(subscriber) {
        if (!this.subscribers.includes(subscriber)) {
            this.subscribers.push(subscriber);
        }
    }

    // Remove a subscriber
    unsubscribe(subscriber) {
        this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
    }

    // Notify all subscribers with new news
    broadcastNews(news) {
        this.subscribers.forEach(subscriber => {
            subscriber.update(news);
        });
    }
}


class MobilePhone {
    update(news) {
        console.log(`Mobile Phone Alert: ${news}`);
    }
}

class TV {
    update(news) {
        console.log(`TV News Flash: ${news}`);
    }
}

class Laptop {
    update(news) {
        console.log(`Laptop Notification: ${news}`);
    }
}

// Initialize the news publisher
const newsAgency = new NewsPublisher();

// Create subscribers
const myPhone = new MobilePhone();
const myTV = new TV();
const myLaptop = new Laptop();

// Subscribe devices to the news agency
newsAgency.subscribe(myPhone);
newsAgency.subscribe(myTV);
newsAgency.subscribe(myLaptop);

// Broadcast news
newsAgency.broadcastNews("A major breakthrough in technology announced today!");

// Unsubscribe TV for some reason
newsAgency.unsubscribe(myTV);

// Broadcast another news
newsAgency.broadcastNews("Weather update: Expect heavy rain tomorrow.");

// Only mobile phone and laptop will receive this update now
