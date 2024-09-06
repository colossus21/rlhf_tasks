// Observer interface
class Observer {
    update(message) {
        throw new Error("Must implement update method");
    }
}

// Logger observer implementation
class Logger extends Observer {
    update(message) {
        console.log(`LOG: ${message}`);
    }
}

// BackupSystem observer implementation
class BackupSystem extends Observer {
    update(message) {
        console.log(`Backup: ${message}`);
    }
}

// Subject (Observable)
class NotificationSubject {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }

    notify(message) {
        this.observers.forEach((observer) => observer.update(message));
    }
}

// Refactor the Notification classes to extend from NotificationSubject
class EmailNotification extends NotificationSubject {
    send(message) {
        console.log(`Sending email: ${message}`);
        this.notify(message); // Notify all observers when the email is sent
    }
}

class SMSNotification extends NotificationSubject {
    send(message) {
        console.log(`Sending SMS: ${message}`);
        this.notify(message); // Notify all observers when the SMS is sent
    }
}

class PushNotification extends NotificationSubject {
    send(message) {
        console.log(`Sending push notification: ${message}`);
        this.notify(message); // Notify all observers when the push notification is sent
    }
}

class NotificationFactory {
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

// Usage
const logger = new Logger();
const backupSystem = new BackupSystem();
const factory = new NotificationFactory();

const emailNotification = factory.createNotification("email");
emailNotification.addObserver(logger);
emailNotification.addObserver(backupSystem);

emailNotification.send("Hello World");

// Output:
// Sending email: Hello World
// LOG: Hello World
// Backup: Hello World
