const EventEmitter = require('events');

class EventHandler extends EventEmitter {
    constructor() {
        super();
        this.events = new Map();
        this.setupDefaultEvents();
    }

    setupDefaultEvents() {
        // System Events
        this.registerEvent('system:startup', 'System startup event');
        this.registerEvent('system:shutdown', 'System shutdown event');
        
        // User Events
        this.registerEvent('user:created', 'New user created');
        this.registerEvent('user:updated', 'User information updated');
        this.registerEvent('user:deleted', 'User deleted');
        
        // Data Events
        this.registerEvent('data:imported', 'Data import completed');
        this.registerEvent('data:exported', 'Data export completed');
        
        // Error Events
        this.registerEvent('error:system', 'System error occurred');
        this.registerEvent('error:validation', 'Validation error occurred');
    }

    registerEvent(eventName, description) {
        this.events.set(eventName, {
            name: eventName,
            description,
            timestamp: new Date(),
            listeners: []
        });
    }

    async emitEvent(eventName, data = {}) {
        if (!this.events.has(eventName)) {
            throw new Error(`Event ${eventName} is not registered`);
        }

        const eventData = {
            ...data,
            timestamp: new Date(),
            eventName
        };

        try {
            this.emit(eventName, eventData);
            return true;
        } catch (error) {
            this.emit('error:system', {
                error,
                eventName,
                timestamp: new Date()
            });
            return false;
        }
    }

    addEventListener(eventName, listener) {
        if (!this.events.has(eventName)) {
            throw new Error(`Event ${eventName} is not registered`);
        }

        const event = this.events.get(eventName);
        event.listeners.push(listener);
        this.on(eventName, listener);
    }

    removeEventListener(eventName, listener) {
        if (!this.events.has(eventName)) {
            throw new Error(`Event ${eventName} is not registered`);
        }

        const event = this.events.get(eventName);
        event.listeners = event.listeners.filter(l => l !== listener);
        this.removeListener(eventName, listener);
    }

    getEventInfo(eventName) {
        return this.events.get(eventName);
    }

    getAllEvents() {
        return Array.from(this.events.values());
    }

    clearEventListeners(eventName) {
        if (!this.events.has(eventName)) {
            throw new Error(`Event ${eventName} is not registered`);
        }

        const event = this.events.get(eventName);
        event.listeners.forEach(listener => {
            this.removeListener(eventName, listener);
        });
        event.listeners = [];
    }
}

module.exports = new EventHandler(); 