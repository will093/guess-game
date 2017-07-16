import { Injectable } from '@angular/core';
import { BluetoothServer } from './bluetooth-server';
import { BluetoothClient } from './bluetooth-client';
import { BluetoothConfig } from './bluetooth-config';
import * as encoding from 'text-encoding';
import { IEvent, Event } from '../../models/event';

declare var networking: any;

// Provides a simple interface for connecting 2 devices via bluetooth, using 
// the following Cordova plugin: https://www.npmjs.com/package/cordova-plugin-networking-bluetooth
//
// TODO: tidy up error logging, including using sprintf for string formatting.
//
@Injectable()
export class BluetoothNetworkingService {

    private _opponentSocketId: string;
    private _successMessage: string = 'Successfully connected!';
    private _partiallyReceivedData: string = '';

    constructor(private bluetoothServer: BluetoothServer, private bluetoothClient: BluetoothClient, private bluetoothConfig: BluetoothConfig) {}

    // Set up a the device as a server, which a client can connect to.
    public connectAsServer = (): Promise < string > => {
        return this.connect(this.bluetoothServer.connect, 1);
    }

    // Connect to the other device as a client.
    public connectAsClient = (): Promise < string > => {
        return this.connect(this.bluetoothClient.connect, this.bluetoothConfig.maxConnectionAttempts);
    }

    private connect = (connect: (onReceive: Function) => Promise < string >, attempts: number): Promise < string > => {

        let connectPromise = new Promise < string > ((resolve, reject) => {
            let i = 1;

            let attemptConnect = (): void => {
                console.log('Attempting to connect - attempt ' + i + ' of ' + attempts);

                connect(this.onReceive).then((opponentSocketId) => {
                    this._opponentSocketId = opponentSocketId;
                    resolve(this._successMessage);
                }, (errorMessage) => {
                    console.log('Connection attempt' + i + ' of ' + attempts + ' failed.');
                    if (i < attempts) {
                        i++;
                        attemptConnect();
                        return;
                    }
                    reject(errorMessage);
                });
            };
            attemptConnect();
        });

        return connectPromise.then((successMessage) => {
            networking.bluetooth.onReceiveError.addListener(this.onReceiveError);
            return successMessage;
        });
    }

    // Close any open server connection to the other device.
    public closeConnectionAsServer = (): Promise < any > => {
        networking.bluetooth.onReceiveError.removeListener(this.onReceiveError);
        this._opponentSocketId = undefined;
        return this.bluetoothServer.closeConnection();
    }

    // Close any open client connection to the other device.
    public closeConnectionAsClient = (): Promise < any > => {
        networking.bluetooth.onReceiveError.removeListener(this.onReceiveError);
        this._opponentSocketId = undefined;
        return this.bluetoothClient.closeConnection();
    }

    // Send data to the other device.
    public send = (serialisable: Object): void => {
        let stringified = JSON.stringify(serialisable);
        let buffer = new encoding.TextEncoder().encode(stringified).buffer;

        console.log('Sending data:');
        console.log(stringified);

        networking.bluetooth.send(this._opponentSocketId, buffer, (bytesSent) => {
            console.log('Sent ' + bytesSent + ' bytes');
        }, (errorMessage) => {
            console.log('Send failed: ' + errorMessage);
        });
    }

    // Event which is triggered whenever data is received on the correct socket.
    public onDataReceived: IEvent < Object > = new Event < Object > ();

    // Event which is triggered whenever there is an error receiving data.
    public onDataReceivedError: IEvent < any > = new Event < any > ();

    private onReceive = (receiveInfo: any): void => {
        console.log('Data recieved:');
        console.log(receiveInfo);
        console.log(receiveInfo.data.byteLength);

        if (receiveInfo.socketId !== this._opponentSocketId) {
            console.log('Received data is on the wrong socket, should be socket ' + this._opponentSocketId + ', but was socket ' + receiveInfo.socketId);
            return;
        }

        let receivedDataEncoded = new Uint8Array(receiveInfo.data);
        let receivedDataJson = new encoding.TextDecoder().decode(receivedDataEncoded);
        
        this._partiallyReceivedData += receivedDataJson;

        try {
            let receivedData = JSON.parse(this._partiallyReceivedData);

            console.log('Decoded received data:');
            console.log(receivedData);
            this.onDataReceived.trigger(receivedData);
            this._partiallyReceivedData = '';
        } catch (error) {
            console.log('Incomplete data received:');
            console.log(this._partiallyReceivedData);
        }
    }

    private onReceiveError = (errorInfo: any): void => {
        console.log('A data receive error occured: ');
        console.log(errorInfo);

        this.onDataReceivedError.trigger(errorInfo);
    }
}

