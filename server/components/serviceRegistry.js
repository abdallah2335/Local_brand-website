const axios = require('axios');

class ServiceRegistry {
    constructor() {
        this.services = new Map();
        this.healthChecks = new Map();
        this.registryUrl = process.env.SERVICE_REGISTRY_URL || 'http://localhost:3000';
    }

    // Register a new service
    async registerService(serviceInfo) {
        try {
            const { name, version, endpoint, healthCheck } = serviceInfo;
            
            if (!name || !version || !endpoint) {
                throw new Error('Missing required service information');
            }

            const service = {
                name,
                version,
                endpoint,
                status: 'active',
                lastHeartbeat: new Date(),
                metadata: serviceInfo.metadata || {}
            };

            // Register with central registry
            await axios.post(`${this.registryUrl}/services`, service);

            // Store locally
            this.services.set(name, service);

            // Setup health check if provided
            if (healthCheck) {
                this.setupHealthCheck(name, healthCheck);
            }

            return service;
        } catch (error) {
            throw new Error(`Service registration failed: ${error.message}`);
        }
    }

    // Deregister a service
    async deregisterService(serviceName) {
        try {
            await axios.delete(`${this.registryUrl}/services/${serviceName}`);
            this.services.delete(serviceName);
            this.healthChecks.delete(serviceName);
            return true;
        } catch (error) {
            throw new Error(`Service deregistration failed: ${error.message}`);
        }
    }

    // Setup health check for a service
    setupHealthCheck(serviceName, healthCheckConfig) {
        const { endpoint, interval = 30000, timeout = 5000 } = healthCheckConfig;
        
        const check = setInterval(async () => {
            try {
                const response = await axios.get(endpoint, { timeout });
                if (response.status === 200) {
                    await this.updateServiceStatus(serviceName, 'active');
                } else {
                    await this.updateServiceStatus(serviceName, 'unhealthy');
                }
            } catch (error) {
                await this.updateServiceStatus(serviceName, 'unhealthy');
            }
        }, interval);

        this.healthChecks.set(serviceName, check);
    }

    // Update service status
    async updateServiceStatus(serviceName, status) {
        try {
            const service = this.services.get(serviceName);
            if (!service) {
                throw new Error(`Service ${serviceName} not found`);
            }

            service.status = status;
            service.lastHeartbeat = new Date();

            await axios.put(`${this.registryUrl}/services/${serviceName}/status`, {
                status,
                lastHeartbeat: service.lastHeartbeat
            });

            return service;
        } catch (error) {
            throw new Error(`Status update failed: ${error.message}`);
        }
    }

    // Get service information
    async getService(serviceName) {
        try {
            const response = await axios.get(`${this.registryUrl}/services/${serviceName}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get service information: ${error.message}`);
        }
    }

    // Get all registered services
    async getAllServices() {
        try {
            const response = await axios.get(`${this.registryUrl}/services`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get services: ${error.message}`);
        }
    }

    // Cleanup health checks
    cleanup() {
        for (const [serviceName, check] of this.healthChecks) {
            clearInterval(check);
            this.healthChecks.delete(serviceName);
        }
    }
}

module.exports = new ServiceRegistry(); 