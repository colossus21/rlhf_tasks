class TaskManager {
    constructor() {
        // Store all tasks
        this.tasks = [];
        // Store event handlers for different events
        this.eventHandlers = {};
    }

    // Method to subscribe to events
    on(eventName, handler) {
        // Initialize event array if not exists
        if (!this.eventHandlers[eventName]) {
            this.eventHandlers[eventName] = [];
        }
        // Add the handler to the event's array
        this.eventHandlers[eventName].push(handler);
    }

    // Emit an event to all subscribed handlers
    emit(eventName, data) {
        const handlers = this.eventHandlers[eventName];
        if (handlers) {
            // Call each handler with the provided data
            handlers.forEach((handler) => handler(data));
        }
    }

    // Add a new task to the task list and emit an event
    addTask(description, duration) {
        const task = new Task(description, duration);
        this.tasks.push(task);
        this.emit("taskAdded", task);
        return task;
    }

    // Run a specific task with timeout to simulate duration
    runTask(task) {
        this.emit("taskStarted", task);
        return new Promise((resolve) => {
            // Set timeout for the task duration
            setTimeout(() => {
                task.complete();
                this.emit("taskCompleted", task);
                resolve(task); // Resolve promise when task is done
            }, task.duration);
        });
    }

    // Run all tasks in parallel using Promise.all
    runAllTasks() {
        return Promise.all(this.tasks.map((task) => this.runTask(task)));
    }
}

class Task {
    constructor(description, duration = 1000) {
        this.description = description;
        this.duration = duration; // Default duration set to 1000ms if not provided
        this.completed = false;
    }

    // Mark the task as completed
    complete() {
        this.completed = true;
    }

    // String representation of the task
    toString() {
        return `${this.description} (Duration: ${this.duration} ms, Completed: ${this.completed})`;
    }
}

// Usage example
const taskManager = new TaskManager();

// Register event handlers for different task events
taskManager.on("taskAdded", (task) => console.log(`Task added: ${task}`));
taskManager.on("taskStarted", (task) => console.log(`Task started: ${task}`));
taskManager.on("taskCompleted", (task) =>
    console.log(`Task completed: ${task}`),
);

// Adding tasks
const tasks = [
    taskManager.addTask("Write an article", 2000),
    taskManager.addTask("Create a tutorial", 3000),
    taskManager.addTask("Record a video", 4000),
];

// An IIFE to handle asynchronous task completion
(async function () {
    await taskManager.runAllTasks();
    console.log("All tasks completed:");
    // Print details of all tasks after completion
    tasks.forEach((task) => console.log(task.toString()));
})();
