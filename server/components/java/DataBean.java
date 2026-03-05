package com.localbrand.components;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class DataBean implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String id;
    private String name;
    private String description;
    private Date createdAt;
    private Date updatedAt;
    private Map<String, Object> metadata;
    private boolean active;
    private int version;

    // Default constructor
    public DataBean() {
        this.metadata = new HashMap<>();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.active = true;
        this.version = 1;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        this.updatedAt = new Date();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
        this.updatedAt = new Date();
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Map<String, Object> getMetadata() {
        return new HashMap<>(metadata);
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = new HashMap<>(metadata);
        this.updatedAt = new Date();
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
        this.updatedAt = new Date();
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
        this.updatedAt = new Date();
    }

    // Utility methods
    public void addMetadata(String key, Object value) {
        this.metadata.put(key, value);
        this.updatedAt = new Date();
    }

    public Object getMetadataValue(String key) {
        return this.metadata.get(key);
    }

    public void removeMetadata(String key) {
        this.metadata.remove(key);
        this.updatedAt = new Date();
    }

    public void incrementVersion() {
        this.version++;
        this.updatedAt = new Date();
    }

    @Override
    public String toString() {
        return "DataBean{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", metadata=" + metadata +
                ", active=" + active +
                ", version=" + version +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DataBean dataBean = (DataBean) o;
        return id != null && id.equals(dataBean.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
} 