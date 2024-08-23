const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

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
                const worker = new Worker(__filename, {
                    workerData: { type: subscriber.type, id: subscriber.id, news }
                });
                worker.on('message', () => {
                    resolve();
                });
                worker.on('error', (error) => {
                    console.error(`Error in subscriber ${subscriber.type} ${subscriber.id}: ${error}`);
                    resolve();
                });
            })
        );

        await Promise.all(notificationPromises);
        console.log("Broadcast completed");
    }
}

class Subscriber {
    constructor(type, id) {
        this.type = type;
        this.id = id;
    }
}

// Worker thread code
if (!isMainThread) {
    const { type, id, news } = workerData;

    switch (type) {
        case 'MobilePhone':
            // Simulate an infinite loop for mobile phones
            while(true) {
                // This will block this worker, but not the main thread
            }
            break;
        case 'TV':
            console.log(`TV ${id} News Flash: ${news}`);
            break;
        case 'Laptop':
            console.log(`Laptop ${id} Notification: ${news}`);
            break;
    }

    parentPort.postMessage('done');
}

// Main thread code
if (isMainThread) {
    async function runNewsSystem() {
        const newsAgency = new NewsPublisher();

        // Create multiple subscribers
        const devices = [
            new Subscriber('MobilePhone', 1),
            new Subscriber('MobilePhone', 2),
            new Subscriber('TV', 1),
            new Subscriber('TV', 2),
            new Subscriber('Laptop', 1),
            new Subscriber('Laptop', 2)
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
}