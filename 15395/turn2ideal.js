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

  getSettings() {
    return this.settings;
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    // Optional: Save the updated settings back to the JSON file
    this.saveSettings();
  }

  saveSettings() {
    const configPath = path.join(__dirname, "config.json");
    fs.writeFileSync(configPath, JSON.stringify(this.settings, null, 4));
  }
}

// Usage:
const configManager = ConfigurationManager.getInstance();
console.log(configManager.getSettings()); // Loaded from config.json or default

// Update some settings
configManager.updateSettings({ theme: "dark" });

// Now the config.json would be updated if saveSettings() is uncommented
