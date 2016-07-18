import { Injectable } from 'angular2/core';
import { PlayerRole, OwnPlayer } from '../player';
import { BluetoothServer } from './bluetooth-server';
import { BluetoothClient } from './bluetooth-client';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { IEvent, Event} from '../event';

declare var networking: any;

// Provides a simple interface for connecting 2 devices via bluetooth, using 
// the following Cordova plugin: https://www.npmjs.com/package/cordova-plugin-networking-bluetooth
@Injectable()
export class BluetoothNetworkingService {

    private opponentSocketId: string;
    private successMessage: string = 'Successfully connected!';
    private encoder: TextEncoder;
    private decoder: TextDecoder;

    constructor(private ownPlayer: OwnPlayer, private bluetoothServer: BluetoothServer, private bluetoothClient: BluetoothClient) {
        this.encoder = new TextEncoder('utf-8');
        this.decoder = new TextDecoder('utf-8');
    }

    // TODO: bluetooth networking should not know about game logic, players etc...
    // Connect to the other device.
    public connect = (): Promise < string > => {
        return new Promise((resolve, reject) => {
            if (this.ownPlayer.role === PlayerRole.Host) {
                this.bluetoothServer.connect(this.onReceive).then((clientSocketId) => {
                    this.opponentSocketId = clientSocketId;
                    resolve(this.successMessage);
                }, (errorMessage) => {
                    reject(errorMessage);
                });
            } else {
                this.bluetoothClient.connect(this.onReceive).then((serverSocketId) => {
                    this.opponentSocketId = serverSocketId;
                    resolve(this.successMessage);
                }, (errorMessage) => {
                    reject(errorMessage);
                });
            }

            networking.bluetooth.onReceiveError.addListener(this.onReceiveError);
        });
    }

    // Close any open connection to the other device.
    public closeConnection = (): Promise < any > => {
        networking.bluetooth.onReceiveError.removeListener(this.onReceiveError);
        this.opponentSocketId = undefined;

        if (this.ownPlayer.role === PlayerRole.Host) {
            return this.bluetoothServer.closeConnection();
        } else {
            return this.bluetoothClient.closeConnection();
        }
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
    public onDataReceived: IEvent<Object> = new Event<Object>();

    // Event which is triggered whenever there is an error receiving data.
    public onDataReceivedError: IEvent<any> = new Event<any>();

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

