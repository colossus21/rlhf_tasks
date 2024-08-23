const fs = require("fs");
const path = require("path");

class ConfigurationManager {
    constructor() {
        if (ConfigurationManager.instance) {
            throw new Error(
                "Error: Use ConfigurationManager.getInstance() instead of new.",
            );
        }
        this.settings = this.loadSettings();
        this.observers = [];
        ConfigurationManager.instance = this;
    }

    static getInstance() {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    loadSettings() {
        const configPath = path.join(__dirname, "config.json");
        try {
            const data = fs.readFileSync(configPath, "utf8");
            return JSON.parse(data);
        } catch (error) {
            console.error("Error loading configuration:", error);
            return { theme: "default" }; // Default settings
        }
    }

    getSettings() {
        return this.settings;
    }

    updateSettings(newSettings) {
        const oldSettings = { ...this.settings };
        this.settings = { ...this.settings, ...newSettings };
        this.notifyObservers(this.settings, oldSettings);
        this.saveSettings();
    }

    saveSettings() {
        const configPath = path.join(__dirname, "config.json");
        fs.writeFileSync(configPath, JSON.stringify(this.settings, null, 4));
    }

    // Observer pattern methods
    addObserver(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    removeObserver(observer) {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }

    notifyObservers(newSettings, oldSettings) {
        this.observers.forEach((observer) =>
            observer.update(newSettings, oldSettings),
        );
    }
}

// Example Observer
class Logger {
    update(newSettings, oldSettings) {
        console.log(
            "Configuration changed from:",
            oldSettings,
            "to:",
            newSettings,
        );
    }
}

// Usage:
const configManager = ConfigurationManager.getInstance();
const logger = new Logger();

configManager.addObserver(logger);

// This will trigger an update notification
configManager.updateSettings({ theme: "dark" });

// Later, if you want to stop receiving updates
// configManager.removeObserver(logger);
