const { setImmediate } = require('timers');

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
                setImmediate(() => {
                    subscriber.update(news)
                        .then(() => resolve())
                        .catch(error => {
                            console.error(`Error notifying subscriber ${subscriber.constructor.name}: ${error}`);
                            resolve();
                        });
                });
            })
        );

        await Promise.all(notificationPromises);
        console.log("Broadcast completed");
    }
}

class MobilePhone {
    constructor(id) {
        this.id = id;
        this.running = true;
    }

    // Simulate an infinite loop with asynchronous behavior
    async update(news) {
        console.log(`Mobile Phone ${this.id} starts processing: ${news}`);
        while(this.running) {
            // Simulate work without blocking
            await new Promise(setImmediate);
            // Here you could add some work or check for conditions to break the loop
        }
        console.log(`Mobile Phone ${this.id} Alert: ${news}`);
    }

    stop() {
        this.running = false;
    }
}

class TV {
    constructor(id) {
        this.id = id;
    }

    async update(news) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));
        console.log(`TV ${this.id} News Flash: ${news}`);
    }
}

class Laptop {
    constructor(id) {
        this.id = id;
    }

    async update(news) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));
        console.log(`Laptop ${this.id} Notification: ${news}`);
    }
}

// Usage
(async () => {
    const newsAgency = new NewsPublisher();
    const mobile = new MobilePhone(1);
    const tv = new TV(1);
    const laptop = new Laptop(1);

    newsAgency.subscribe(mobile);
    newsAgency.subscribe(tv);
    newsAgency.subscribe(laptop);

    // Broadcasting news
    newsAgency.broadcastNews("Important Announcement!");

    // Let's simulate stopping the mobile phone's loop after some time
    setTimeout(() => {
        mobile.stop();
        console.log("Mobile phone has been stopped.");
    }, 5000);

    // Even with mobile in a loop, other devices should still receive this news
    setTimeout(() => {
        newsAgency.broadcastNews("Follow-up News!");
    }, 10000);

})();