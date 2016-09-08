import { Injectable } from 'angular2/core';
import { BluetoothServer } from './bluetooth-server';
import { BluetoothClient } from './bluetooth-client';
import { BluetoothConfig } from './bluetooth-config';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { IEvent, Event } from '../event';

declare var networking: any;

// Provides a simple interface for connecting 2 devices via bluetooth, using 
// the following Cordova plugin: https://www.npmjs.com/package/cordova-plugin-networking-bluetooth
//
// TODO: tidy up error logging, including using sprintf for string formatting.
//
@Injectable()
export class BluetoothNetworkingService {

    private opponentSocketId: string;
    private successMessage: string = 'Successfully connected!';
    private encoder: TextEncoder;
    private decoder: TextDecoder;

    constructor(private bluetoothServer: BluetoothServer, private bluetoothClient: BluetoothClient, private bluetoothConfig: BluetoothConfig) {
        this.encoder = new TextEncoder('utf-8');
        this.decoder = new TextDecoder('utf-8');
    }

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
                    this.opponentSocketId = opponentSocketId;
                    resolve(this.successMessage);
                }, (errorMessage) => {
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
        this.opponentSocketId = undefined;
        return this.bluetoothServer.closeConnection();
    }

    // Close any open client connection to the other device.
    public closeConnectionAsClient = (): Promise < any > => {
        networking.bluetooth.onReceiveError.removeListener(this.onReceiveError);
        this.opponentSocketId = undefined;
        return this.bluetoothClient.closeConnection();
    }

    // Send data to the other device.
    public send = (serialisable: Object): void => {
        let stringified = JSON.stringify(serialisable);
        let buffer = new TextEncoder().encode(stringified).buffer;

        console.log('Sending data:');
        console.log(buffer);

        networking.bluetooth.send(this.opponentSocketId, buffer, (bytesSent) => {
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

        if (receiveInfo.socketId !== this.opponentSocketId) {
            console.log('Received data is on the wrong socket, should be socket ' + this.opponentSocketId + ', but was socket ' + receiveInfo.socketId);
            return;
        }

        let receivedDataEncoded = new Uint8Array(receiveInfo.data);
        let receivedDataJson = new TextDecoder().decode(receivedDataEncoded.buffer);
        let receivedData = JSON.parse(receivedDataJson);

        console.log('Decoded received data:');
        console.log(receivedData);
        this.onDataReceived.trigger(receivedData);
    }

    private onReceiveError = (errorInfo: any): void => {
        console.log('A data receive error occured: ');
        console.log(errorInfo);

        this.onDataReceivedError.trigger(errorInfo);
    }
}

