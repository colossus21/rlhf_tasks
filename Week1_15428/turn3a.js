class NotificationFactory {
    // Declare a static instance property for Singleton
    static instance;

    // Make the constructor private to prevent external instantiation
    constructor() {
        if (NotificationFactory.instance) {
            throw new Error(
                "This is a Singleton class. Use getInstance() instead of new.",
            );
        }
        NotificationFactory.instance = this;
    }

    // Method to get the Singleton instance
    static getInstance() {
        if (!NotificationFactory.instance) {
            NotificationFactory.instance = new NotificationFactory();
        }
        return NotificationFactory.instance;
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

// The rest of your classes would remain unchanged

// Usage would change slightly since now we get the instance instead of creating one:
const factoryInstance = NotificationFactory.getInstance();

// Adding observers remains the same as in the previous example
const logger = new LoggerObserver();
const backupSystem = new BackupSystemObserver();

const emailNotification = factoryInstance.createNotification("email");
emailNotification.addObserver(logger);
emailNotification.addObserver(backupSystem);
emailNotification.send("Hello from Singleton Factory!");

// Attempting to instantiate another factory directly will result in an error
try {
    const anotherFactory = new NotificationFactory();
} catch (e) {
    console.log(e.message); // Outputs: This is a Singleton class. Use getInstance() instead of new.
}
