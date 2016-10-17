
import { Injectable } from '@angular/core';
import { IEvent, Event } from './event';

// Fake networking service for running app in browser.
@Injectable()
export class FakeNetworkingService {

    public connectAsServer = (): Promise < string > => {
        return new Promise<string>(function(resolve, reject) {
            setTimeout(() => {
                resolve('Connected');
            }, 1000);
        });
    }

    public connectAsClient = (): Promise < string > => {
        return new Promise<string>(function(resolve, reject) {
            reject('Failed to connect');
        });
    }

    public closeConnectionAsServer = (): Promise < any > => {
        return Promise.resolve();
    }

    public closeConnectionAsClient = (): Promise < any > => {
        return Promise.resolve();
    }

    public send = (serialisable: Object): void => { 
        return;
    }

    public onDataReceived: IEvent < Object > = new Event < Object > ();

    public onDataReceivedError: IEvent < any > = new Event < any > ();
}

