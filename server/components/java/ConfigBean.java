package com.localbrand.components;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;
import java.util.logging.Logger;
import java.util.logging.Level;

public class ConfigBean {
    private static final Logger LOGGER = Logger.getLogger(ConfigBean.class.getName());
    private static final String CONFIG_FILE = "application.properties";
    
    private Properties properties;
    private String configPath;
    private boolean isLoaded;

    public ConfigBean() {
        this.properties = new Properties();
        this.isLoaded = false;
    }

    public ConfigBean(String configPath) {
        this();
        this.configPath = configPath;
        loadConfig();
    }

    // Configuration Loading
    public void loadConfig() {
        try {
            FileInputStream input = new FileInputStream(configPath + "/" + CONFIG_FILE);
            properties.load(input);
            input.close();
            isLoaded = true;
            LOGGER.info("Configuration loaded successfully from: " + configPath + "/" + CONFIG_FILE);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error loading configuration", e);
            throw new RuntimeException("Failed to load configuration", e);
        }
    }

    public void saveConfig() {
        try {
            FileOutputStream output = new FileOutputStream(configPath + "/" + CONFIG_FILE);
            properties.store(output, "Updated configuration");
            output.close();
            LOGGER.info("Configuration saved successfully to: " + configPath + "/" + CONFIG_FILE);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error saving configuration", e);
            throw new RuntimeException("Failed to save configuration", e);
        }
    }

    // Property Management
    public String getProperty(String key) {
        return properties.getProperty(key);
    }

    public String getProperty(String key, String defaultValue) {
        return properties.getProperty(key, defaultValue);
    }

    public void setProperty(String key, String value) {
        properties.setProperty(key, value);
        LOGGER.info("Property set: " + key + " = " + value);
    }

    public void removeProperty(String key) {
        properties.remove(key);
        LOGGER.info("Property removed: " + key);
    }

    public boolean containsProperty(String key) {
        return properties.containsKey(key);
    }

    // Configuration State
    public boolean isLoaded() {
        return isLoaded;
    }

    public String getConfigPath() {
        return configPath;
    }

    public void setConfigPath(String configPath) {
        this.configPath = configPath;
        if (isLoaded) {
            loadConfig();
        }
    }

    // Configuration Validation
    public boolean validateRequiredProperties(String... requiredKeys) {
        for (String key : requiredKeys) {
            if (!properties.containsKey(key) || properties.getProperty(key).trim().isEmpty()) {
                LOGGER.warning("Required property missing or empty: " + key);
                return false;
            }
        }
        return true;
    }

    // Configuration Groups
    public Properties getPropertiesByPrefix(String prefix) {
        Properties filteredProps = new Properties();
        for (String key : properties.stringPropertyNames()) {
            if (key.startsWith(prefix)) {
                filteredProps.setProperty(key, properties.getProperty(key));
            }
        }
        return filteredProps;
    }

    public void setPropertiesByPrefix(String prefix, Properties props) {
        for (String key : props.stringPropertyNames()) {
            if (key.startsWith(prefix)) {
                properties.setProperty(key, props.getProperty(key));
            }
        }
    }

    // Configuration Reset
    public void resetToDefaults() {
        properties.clear();
        isLoaded = false;
        LOGGER.info("Configuration reset to defaults");
    }

    @Override
    public String toString() {
        return "ConfigBean{" +
                "configPath='" + configPath + '\'' +
                ", isLoaded=" + isLoaded +
                ", properties=" + properties +
                '}';
    }
} 