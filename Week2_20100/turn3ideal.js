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
                setImmediate(async () => {
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error(`Timeout for subscriber`)), 10000)
                    );

                    try {
                        await Promise.race([
                            subscriber.update(news),
                            timeoutPromise
                        ]);
                        resolve({status: 'fulfilled'});
                    } catch (error) {
                        console.error(`Error notifying subscriber: ${error.message}`);
                        resolve({status: 'rejected', reason: error.message});
                    }
                });
            })
        );

        await Promise.allSettled(notificationPromises);
        console.log("Broadcast completed");
    }
}

class MobilePhone {
    constructor(id) {
        this.id = id;
    }

    async update(news) {
        const abortController = new AbortController();

        // Start an asynchronous infinite loop that listens to the AbortSignal
        const infiniteLoop = async () => {
            while (!abortController.signal.aborted) {
                await new Promise(resolve => setTimeout(resolve, 100));  // Non-blocking loop
                console.log(`Mobile Phone ${this.id} stuck in a loop, still processing news: ${news}`);
            }
        };

        // Run the loop and set a timeout to abort it after 10ms
        try {
            await Promise.race([
                infiniteLoop(),
                new Promise((_, reject) => setTimeout(() => {
                    abortController.abort();
                    reject(new Error("Update took too long"));
                }, 10))
            ]);
        } catch (error) {
            console.log(`Mobile Phone ${this.id} update aborted: ${error.message}`);
        }
    }
}

class TV {
    constructor(id) {
        this.id = id;
    }

    async update(news) {
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
