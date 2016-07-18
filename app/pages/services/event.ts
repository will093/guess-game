import { Injectable } from 'angular2/core';

export interface IEvent<T> {
    subscribe(handler: { (data?: T): void }): void;
    unsubscribe(handler: { (data?: T): void }): void;
    trigger(data?: T): void;
}

// A simple implementation of an event.
@Injectable()
export class Event<T> implements IEvent<T> {
    
    private handlers: { (data?: T): void; }[] = [];

    public subscribe(handler: { (data?: T): void }) {
        this.handlers.push(handler);
    }

    public unsubscribe(handler: { (data?: T): void }) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(data?: T) {
        this.handlers.slice(0).forEach(h => h(data));
    }
}
