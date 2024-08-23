const fs = require("fs");
const path = require("path");

class ConfigurationManager {
    constructor() {
        if (ConfigurationManager.instance) {
            throw new Error(
                "Error: Instantiation failed: Use ConfigurationManager.getInstance() instead of new.",
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
            console.error("Error loading configuration from file:", error);
            return { theme: "default" }; // Fallback settings
        }
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers() {
        this.observers.forEach((observer) => observer(this.settings));
    }

    getSettings() {
        return this.settings;
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
        this.notifyObservers();
    }

    saveSettings() {
        const configPath = path.join(__dirname, "config.json");
        fs.writeFileSync(configPath, JSON.stringify(this.settings, null, 4));
    }
}

// Usage:
const configManager = ConfigurationManager.getInstance();

function observer1(settings) {
    console.log("Observer 1:", settings);
}

function observer2(settings) {
    console.log("Observer 2:", settings);
}

configManager.addObserver(observer1);
configManager.addObserver(observer2);

// Both observers will be notified with the new settings
configManager.updateSettings({ theme: "dark" });

// Remove one observer
configManager.removeObserver(observer1);

// Only the second observer will be notified now
configManager.updateSettings({ language: "en" });
