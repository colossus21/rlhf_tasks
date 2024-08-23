class ConfigurationManager {
    constructor() {
        if (ConfigurationManager.instance) {
            throw new Error(
                "Error: Instantiation failed: Use ConfigurationManager.getInstance() instead of new.",
            );
        }
        ConfigurationManager.instance = this;
        this.settings = { theme: "dark" };
    }

    static getInstance() {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    getSettings() {
        return this.settings;
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
}

// Usage:
const configManager1 = ConfigurationManager.getInstance();
const configManager2 = ConfigurationManager.getInstance();

// Both of these will point to the same instance
console.log(configManager1 === configManager2); // true
