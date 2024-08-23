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

class EmailNotification {
    send(message) {
        console.log(`Sending email: ${message}`);
    }
}

class SMSNotification {
    send(message) {
        console.log(`Sending SMS: ${message}`);
    }
}

class PushNotification {
    send(message) {
        console.log(`Sending push notification: ${message}`);
    }
}

const factory = new NotificationFactory();
const emailNotification = factory.createNotification("email");
emailNotification.send("Hello World");

const smsNotification = factory.createNotification("sms");
smsNotification.send("Hello via SMS");

const pushNotification = factory.createNotification("push");
pushNotification.send("Hello via Push");

// Attempting to create a notification with an unsupported type
try {
    const invalidNotification = factory.createNotification("telegram");
    invalidNotification.send("This should not be called");
} catch (e) {
    console.log(e.message); // This will output: Invalid notification type
}
