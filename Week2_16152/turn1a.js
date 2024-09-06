class TaskManager {
    constructor() {
        this.tasks = []; // Array to store tasks
        this.eventHandlers = {}; // Object to store event handlers
    }

    // Method to register event handlers
    on(eventName, handler) {
        // If no handlers exist for this event, create an empty array
        if (!this.eventHandlers[eventName]) {
            this.eventHandlers[eventName] = [];
        }
        // Add the new handler to the array
        this.eventHandlers[eventName].push(handler);
    }

    // Method to trigger events
    emit(eventName, data) {
        const handlers = this.eventHandlers[eventName];
        if (handlers) {
            // Call all handlers for this event, passing the data
            handlers.forEach((handler) => handler(data));
        }
    }

    // Method to add a new task
    addTask(description, duration) {
        const task = new Task(description, duration);
        this.tasks.push(task);
        this.emit("taskAdded", task); // Trigger taskAdded event
        return task;
    }

    // Method to run a single task
    runTask(task) {
        this.emit("taskStarted", task); // Trigger taskStarted event
        return new Promise((resolve) => {
            // Simulate task execution with setTimeout
            setTimeout(() => {
                task.complete();
                this.emit("taskCompleted", task); // Trigger taskCompleted event
                resolve(task);
            }, task.duration);
        });
    }

    // Method to run all tasks
    runAllTasks() {
        // Use Promise.all to run all tasks concurrently
        return Promise.all(this.tasks.map((task) => this.runTask(task)));
    }
}

class Task {
    constructor(description, duration = 1000) {
        this.description = description;
        this.duration = duration;
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

// Usage
const taskManager = new TaskManager();

// Register event handlers
taskManager.on("taskAdded", (task) => console.log(`Task added: ${task}`));
taskManager.on("taskStarted", (task) => console.log(`Task started: ${task}`));
taskManager.on("taskCompleted", (task) =>
    console.log(`Task completed: ${task}`),
);

// Create tasks
const tasks = [
    taskManager.addTask("Write an article", 2000),
    taskManager.addTask("Create a tutorial", 3000),
    taskManager.addTask("Record a video", 4000),
];

// Run all tasks asynchronously
(async function () {
    await taskManager.runAllTasks();
    console.log("All tasks completed:");
    tasks.forEach((task) => console.log(task.toString()));
})();
