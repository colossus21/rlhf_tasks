class ConfigurationManager {
    static instance;

    constructor() {
        if (ConfigurationManager.instance) {
            return ConfigurationManager.instance;
        }
        this.settings = { theme: "dark" };
        ConfigurationManager.instance = this;
    }

    getSettings() {
        return this.settings;
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
}

const configManager1 = new ConfigurationManager();
const configManager2 = new ConfigurationManager();

console.log(configManager1 === configManager2); // true
