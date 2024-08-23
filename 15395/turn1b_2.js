class ConfigurationManager {
    #instance;

    constructor() {
        if (this.#instance) {
            return this.#instance;
        }
        this.settings = { theme: "dark" };
        this.#instance = this;
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
console.log(configManager1);
console.log(configManager2);
console.log(configManager1 === configManager2); // true
