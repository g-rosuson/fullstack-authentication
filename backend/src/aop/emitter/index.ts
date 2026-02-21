import type { EmitterCallback, EventType, JobTargetEvent } from './types';

import { EventEmitter } from 'events';

/**
 * Emitter is a singleton that emits events.
 */
class Emitter {
    private static instance: Emitter | null = null;
    private emitter = new EventEmitter();
    private emittedJobTargetEvents: JobTargetEvent[] = [];

    private constructor() {
        this.emit = this.emit.bind(this);
        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
    }

    /**
     * Returns the singleton instance of Emitter.
     * Creates a new instance if one doesn't exist.
     *
     * @returns The singleton Emitter instance
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new Emitter();
        }

        return this.instance;
    }

    /**
     * Emits an event and stores it in the emittedJobTargetEvents array.
     *
     * @param eventType The type of the event
     * @param event The event to emit
     */
    public emit(eventType: EventType, event: JobTargetEvent) {
        this.emitter.emit(eventType, event);
        this.emittedJobTargetEvents.push(event);
    }

    /**
     * Adds a listener for an event.
     *
     * @param eventType The type of the event
     * @param callback The callback to add
     */
    public on(eventType: EventType, callback: EmitterCallback) {
        this.emitter.on(eventType, callback);
    }

    /**
     * Removes a listener for an event.
     *
     * @param eventType The type of the event
     * @param callback The callback to remove
     */
    public off(eventType: EventType, callback: EmitterCallback) {
        this.emitter.off(eventType, callback);
    }

    /**
     * Clears all events for a job.
     *
     * @param jobId The ID of the job
     */
    public clearJobTargetEvents(jobId: string) {
        this.emittedJobTargetEvents = this.emittedJobTargetEvents.filter(event => event.jobId !== jobId);
    }

    /**
     * Returns all target events.
     *
     * @returns All target events
     */
    get allEmittedJobTargetEvents(): ReadonlyArray<JobTargetEvent> {
        return [...this.emittedJobTargetEvents];
    }
}

export { Emitter };
