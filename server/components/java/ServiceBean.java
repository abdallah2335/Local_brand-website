package com.localbrand.components;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;
import java.util.logging.Level;

public class ServiceBean {
    private static final Logger LOGGER = Logger.getLogger(ServiceBean.class.getName());
    private static final ConcurrentHashMap<String, DataBean> dataStore = new ConcurrentHashMap<>();
    
    private String serviceId;
    private String serviceName;
    private boolean isRunning;
    private List<String> dependencies;
    private ServiceStatus status;

    public enum ServiceStatus {
        ACTIVE,
        INACTIVE,
        MAINTENANCE,
        ERROR
    }

    public ServiceBean() {
        this.dependencies = new ArrayList<>();
        this.status = ServiceStatus.INACTIVE;
        this.isRunning = false;
    }

    // Getters and Setters
    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public boolean isRunning() {
        return isRunning;
    }

    public void setRunning(boolean running) {
        isRunning = running;
        if (running) {
            this.status = ServiceStatus.ACTIVE;
        } else {
            this.status = ServiceStatus.INACTIVE;
        }
    }

    public List<String> getDependencies() {
        return new ArrayList<>(dependencies);
    }

    public void setDependencies(List<String> dependencies) {
        this.dependencies = new ArrayList<>(dependencies);
    }

    public ServiceStatus getStatus() {
        return status;
    }

    public void setStatus(ServiceStatus status) {
        this.status = status;
        LOGGER.info("Service " + serviceName + " status changed to: " + status);
    }

    // Business Logic Methods
    public void startService() {
        try {
            if (!isRunning) {
                validateDependencies();
                isRunning = true;
                status = ServiceStatus.ACTIVE;
                LOGGER.info("Service " + serviceName + " started successfully");
            }
        } catch (Exception e) {
            status = ServiceStatus.ERROR;
            LOGGER.log(Level.SEVERE, "Error starting service: " + serviceName, e);
            throw new RuntimeException("Failed to start service", e);
        }
    }

    public void stopService() {
        try {
            if (isRunning) {
                isRunning = false;
                status = ServiceStatus.INACTIVE;
                LOGGER.info("Service " + serviceName + " stopped successfully");
            }
        } catch (Exception e) {
            status = ServiceStatus.ERROR;
            LOGGER.log(Level.SEVERE, "Error stopping service: " + serviceName, e);
            throw new RuntimeException("Failed to stop service", e);
        }
    }

    public void addDependency(String dependencyId) {
        if (!dependencies.contains(dependencyId)) {
            dependencies.add(dependencyId);
            LOGGER.info("Added dependency: " + dependencyId + " to service: " + serviceName);
        }
    }

    public void removeDependency(String dependencyId) {
        if (dependencies.remove(dependencyId)) {
            LOGGER.info("Removed dependency: " + dependencyId + " from service: " + serviceName);
        }
    }

    public void putData(DataBean data) {
        try {
            dataStore.put(data.getId(), data);
            LOGGER.info("Data stored successfully with ID: " + data.getId());
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error storing data", e);
            throw new RuntimeException("Failed to store data", e);
        }
    }

    public DataBean getData(String id) {
        try {
            DataBean data = dataStore.get(id);
            if (data == null) {
                LOGGER.warning("Data not found with ID: " + id);
            }
            return data;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error retrieving data", e);
            throw new RuntimeException("Failed to retrieve data", e);
        }
    }

    public void removeData(String id) {
        try {
            if (dataStore.remove(id) != null) {
                LOGGER.info("Data removed successfully with ID: " + id);
            } else {
                LOGGER.warning("No data found to remove with ID: " + id);
            }
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error removing data", e);
            throw new RuntimeException("Failed to remove data", e);
        }
    }

    private void validateDependencies() {
        for (String dependency : dependencies) {
            if (!isDependencyAvailable(dependency)) {
                throw new RuntimeException("Dependency not available: " + dependency);
            }
        }
    }

    private boolean isDependencyAvailable(String dependencyId) {
        // Implement dependency availability check logic here
        return true; // Placeholder implementation
    }

    @Override
    public String toString() {
        return "ServiceBean{" +
                "serviceId='" + serviceId + '\'' +
                ", serviceName='" + serviceName + '\'' +
                ", isRunning=" + isRunning +
                ", dependencies=" + dependencies +
                ", status=" + status +
                '}';
    }
} 