// Task manager to handle tasks and events
class TaskManager {
    constructor() {
        this.tasks = [];
        this.eventHandlers = {};
    }

    // Register an event handler
    on(eventName, handler) {
        if (!this.eventHandlers[eventName]) this.eventHandlers[eventName] = [];
        this.eventHandlers[eventName].push(handler);
    }

    // Emit an event to all registered handlers
    emit(eventName, data) {
        const handlers = this.eventHandlers[eventName];
        if (handlers) handlers.forEach((handler) => handler(data));
    }

    // Add a new task and emit event
    addTask(description, duration) {
        const task = new Task(description, duration);
        this.tasks.push(task);
        this.emit("taskAdded", task);
        return task;
    }

    // Run a task asynchronously
    runTask(task) {
        this.emit("taskStarted", task);
        return new Promise((resolve) => {
            setTimeout(() => {
                task.complete();
                this.emit("taskCompleted", task);
                resolve(task);
            }, task.duration);
        });
    }

    // Run all tasks in parallel
    runAllTasks() {
        return Promise.all(this.tasks.map((task) => this.runTask(task)));
    }
}

// Represents a single task
class Task {
    constructor(description, duration = 1000) {
        this.description = description;
        this.duration = duration;
        this.completed = false;
    }

    // Mark task as complete
    complete() {
        this.completed = true;
    }

    // String representation of task
    toString() {
        return `${this.description} (Duration: ${this.duration}ms, Completed: ${this.completed})`;
    }
}

// Example usage
const taskManager = new TaskManager();

// Event listeners for task operations
taskManager.on("taskAdded", (task) => console.log(`Task added: ${task}`));
taskManager.on("taskStarted", (task) => console.log(`Task started: ${task}`));
taskManager.on("taskCompleted", (task) =>
    console.log(`Task completed: ${task}`),
);

// Adding tasks to the manager
const tasks = [
    taskManager.addTask("Write an article", 2000),
    taskManager.addTask("Create a tutorial", 3000),
    taskManager.addTask("Record a video", 4000),
];

// Asynchronously run all tasks and log results
(async () => {
    await taskManager.runAllTasks();
    console.log("All tasks completed:");
    tasks.forEach((task) => console.log(task.toString()));
})();
