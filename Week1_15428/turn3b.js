class NotificationFactory {
    static getInstance() {
        if (!NotificationFactory.instance) {
            NotificationFactory.instance = new NotificationFactory();
        }
        return NotificationFactory.instance;
    }

    constructor() {
        if (NotificationFactory.instance) {
            throw new Error(
                "This is a Singleton class. Use getInstance() to get the instance.",
            );
        }
    }

    createNotification(type) {
        switch (type.toLowerCase()) {
            case "email":
                return new EmailNotification();
            case "sms":
                return new SMSNotification();
            case "push":
                return new PushNotification();
            default:
                throw new Error("Invalid notification type");
        }
    }
}

// Example of Observers
class LoggerObserver {
    update(message) {
        console.log(`Logging: ${message}`);
    }
}

class BackupSystemObserver {
    update(message) {
        console.log(`Backing up: ${message}`);
    }
}

// Observable class (will be extended by Notification classes)
class Observable {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        if (typeof observer.update !== "function") {
            throw new Error("Observer must implement update method");
        }
        this.observers.push(observer);
    }

    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers(message) {
        for (const observer of this.observers) {
            observer.update(message);
        }
    }
}

// Refactored Notification classes extending Observable
class EmailNotification extends Observable {
    send(message) {
        console.log(`Sending email: ${message}`);
        this.notifyObservers(message);
    }
}

class SMSNotification extends Observable {
    send(message) {
        console.log(`Sending SMS: ${message}`);
        this.notifyObservers(message);
    }
}

class PushNotification extends Observable {
    send(message) {
        console.log(`Sending push notification: ${message}`);
        this.notifyObservers(message);
    }
}

// Usage
const logger = new LoggerObserver();
const backupSystem = new BackupSystemObserver();

const factory = NotificationFactory.getInstance();

const emailNotification = factory.createNotification("email");
emailNotification.addObserver(logger);
emailNotification.addObserver(backupSystem);
emailNotification.send("Hello, World!");

// Output:
// Sending email: Hello, World!
// Logging: Hello, World!
// Backing up: Hello, World!
