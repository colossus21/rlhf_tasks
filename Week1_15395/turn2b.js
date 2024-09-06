const fs = require("fs");

class ConfigurationManager {
    constructor() {
        if (ConfigurationManager.instance) {
            throw new Error(
                "Error: Instantiation failed: Use ConfigurationManager.getInstance() instead of new.",
            );
        }
        ConfigurationManager.instance = this;
        this.loadSettings();
    }

    static getInstance() {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    loadSettings() {
        try {
            const rawData = fs.readFileSync("config.json", "utf8");
            this.settings = JSON.parse(rawData);
        } catch (error) {
            console.error("Error loading configuration from file:", error);
            this.settings = {};
        }
    }

    getSettings() {
        return this.settings;
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
    }

    saveSettings() {
        try {
            fs.writeFileSync(
                "config.json",
                JSON.stringify(this.settings, null, 2),
            );
        } catch (error) {
            console.error("Error saving configuration to file:", error);
        }
    }
}

// Usage:
const configManager1 = ConfigurationManager.getInstance();
const configManager2 = ConfigurationManager.getInstance();

// Both of these will point to the same instance
console.log(configManager1 === configManager2); // true

// Example of updating settings
configManager1.updateSettings({ theme: "light" });
