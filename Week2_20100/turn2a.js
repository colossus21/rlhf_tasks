class NewsPublisher {
    constructor() {
        this.subscribers = [];
    }

    subscribe(subscriber) {
        if (!this.subscribers.includes(subscriber)) {
            this.subscribers.push(subscriber);
        }
    }

    unsubscribe(subscriber) {
        this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
    }

    async broadcastNews(news) {
        console.log(`Broadcasting news: ${news}`);
        const notificationPromises = this.subscribers.map(subscriber =>
            new Promise(resolve => {
                setTimeout(() => {
                    subscriber.update(news)
                        .then(() => resolve())
                        .catch(error => {
                            console.error(`Error notifying subscriber: ${error}`);
                            resolve();
                        });
                }, 0);
            })
        );

        await Promise.all(notificationPromises);
        console.log("Broadcast completed");
    }
}

class MobilePhone {
    constructor(id) {
        this.id = id;
    }

    async update(news) {
        // Simulate random processing time
        const processingTime = Math.random() * 2000;
        await new Promise(resolve => setTimeout(resolve, processingTime));
        console.log(`Mobile Phone ${this.id} Alert: ${news}`);
    }
}

class TV {
    constructor(id) {
        this.id = id;
    }

    async update(news) {
        // Simulate random processing time
        const processingTime = Math.random() * 2000;
        await new Promise(resolve => setTimeout(resolve, processingTime));
        console.log(`TV ${this.id} News Flash: ${news}`);
    }
}

class Laptop {
    constructor(id) {
        this.id = id;
    }

    async update(news) {
        // Simulate random processing time
        const processingTime = Math.random() * 2000;
        await new Promise(resolve => setTimeout(resolve, processingTime));
        console.log(`Laptop ${this.id} Notification: ${news}`);
    }
}

// Usage example
async function runNewsSystem() {
    const newsAgency = new NewsPublisher();

    // Create multiple subscribers
    const devices = [
        new MobilePhone(1),
        new MobilePhone(2),
        new TV(1),
        new TV(2),
        new Laptop(1),
        new Laptop(2)
    ];

    // Subscribe all devices
    devices.forEach(device => newsAgency.subscribe(device));

    // Broadcast multiple news items
    const newsItems = [
        "Breaking: Major tech breakthrough announced!",
        "Weather update: Expect heavy rain tomorrow.",
        "Sports: Home team wins the championship!",
        "Economy: Stock market reaches new heights.",
        "Entertainment: New blockbuster movie released today."
    ];

    for (const news of newsItems) {
        await newsAgency.broadcastNews(news);
        console.log("---");
    }
}

// Run the system
runNewsSystem().then(() => console.log("News broadcasting completed"));