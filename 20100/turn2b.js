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

    // Notify all subscribers with new news asynchronously
    broadcastNews(news) {
        this.subscribers.forEach(subscriber => {
            // Using setTimeout to simulate asynchronous update
            setTimeout(() => {
                try {
                    subscriber.update(news);
                } catch (error) {
                    console.error('Error in subscriber:', error);
                    // Here you could implement logic to handle or remove faulty subscribers
                }
            }, 0); // 0 delay means it will be executed in the next event loop cycle
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

// Example usage
(function() {
    const newsAgency = new NewsPublisher();

    const myPhone = new MobilePhone();
    const myTV = new TV();
    const myLaptop = new Laptop();

    // Let's simulate a slow subscriber
    const slowSubscriber = {
        update: function(news) {
            // Simulate a slow process
            let start = Date.now();
            while (Date.now() - start < 2000) {} // Hold for 2 seconds
            console.log('Slow Subscriber finally got:', news);
        }
    };

    newsAgency.subscribe(myPhone);
    newsAgency.subscribe(myTV);
    newsAgency.subscribe(myLaptop);
    newsAgency.subscribe(slowSubscriber);

    // Broadcast news
    newsAgency.broadcastNews("Important News: Event X has occurred!");

    console.log("Broadcast has been sent out, but subscribers process it in their own time.");

    // This demonstrates that even with a slow subscriber, others are not blocked
    setTimeout(() => {
        newsAgency.broadcastNews("Follow-up: More details on Event X.");
    }, 1000); // Broadcasting another news before the slow subscriber finishes
})();