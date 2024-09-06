class NotificationFactory {
  createNotification(type) {
      switch (type) {
          case 'email':
              return new EmailNotification();
          case 'sms':
              return new SMSNotification();
          case 'push':
              return new PushNotification();
          default:
              throw new Error(`Invalid notification type: ${type}`);
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
const notification = factory.createNotification('email');
notification.send('Hello World');


const emailNotification = factory.createNotification('email');
emailNotification.send('Hello World');

const smsNotification = factory.createNotification('sms');
smsNotification.send('Hello World');

const pushNotification = factory.createNotification('push');
pushNotification.send('Hello World');