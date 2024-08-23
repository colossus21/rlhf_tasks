class TaskManager {
    constructor() {
        this.tasks = [];
        this.eventHandlers = {};
    }

    on(eventName, handler) {
        // Create an empty array for the event if it doesn't exist
        if (!this.eventHandlers[eventName]) {
            this.eventHandlers[eventName] = [];
        }
        this.eventHandlers[eventName].push(handler);
    }

    emit(eventName, data) {
        const handlers = this.eventHandlers[eventName];
        if (handlers) {
            // Call all registered handlers for this event
            handlers.forEach((handler) => handler(data));
        }
    }

    addTask(description, duration) {
        const task = new Task(description, duration);
        this.tasks.push(task);
        // Notify listeners about the new task
        this.emit("taskAdded", task);
        return task;
    }

    runTask(task) {
        // Notify listeners that the task is starting
        this.emit("taskStarted", task);
        return new Promise((resolve) => {
            // Simulate task execution
            setTimeout(() => {
                task.complete();
                // Notify listeners that the task is completed
                this.emit("taskCompleted", task);
                resolve(task);
            }, task.duration);
        });
    }

    runAllTasks() {
        // Execute all tasks concurrently
        return Promise.all(this.tasks.map((task) => this.runTask(task)));
    }
}

class Task {
    constructor(description, duration = 1000) {
        this.description = description;
        this.duration = duration;
        this.completed = false;
    }

    complete() {
        this.completed = true;
    }

    toString() {
        return `${this.description} (Duration: ${this.duration} ms, Completed: ${this.completed})`;
    }
}

// Usage
const taskManager = new TaskManager();

// Register event listeners
taskManager.on("taskAdded", (task) => console.log(`Task added: ${task}`));
taskManager.on("taskStarted", (task) => console.log(`Task started: ${task}`));
taskManager.on("taskCompleted", (task) =>
    console.log(`Task completed: ${task}`),
);

// Create sample tasks
const tasks = [
    taskManager.addTask("Write an article", 2000),
    taskManager.addTask("Create a tutorial", 3000),
    taskManager.addTask("Record a video", 4000),
];

// Execute all tasks and log results
(async function () {
    await taskManager.runAllTasks();
    console.log("All tasks completed:");
    tasks.forEach((task) => console.log(task.toString()));
})();
