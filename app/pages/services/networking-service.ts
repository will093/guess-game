import { Injectable } from 'angular2/core';
import { PlayerRole } from './player-role-enum';
import { OwnPlayer } from './own-player';
import { BluetoothServer } from './bluetooth-server';
import { BluetoothClient } from './bluetooth-client';
import { TextEncoder, TextDecoder } from 'text-encoding';

declare var networking: any;

// TODO can this be BluetoothNetworkingService and then NetworkingService will be a Typescript interface?
@Injectable()
export class NetworkingService {

    private opponentSocketId: string;
    private successMessage: string = 'Successfully connected!';
    private encoder: TextEncoder;
    private decoder: TextDecoder;

    constructor(private ownPlayer: OwnPlayer, private bluetoothServer: BluetoothServer, private bluetoothClient: BluetoothClient) {
        this.encoder = new TextEncoder('utf-8');
        this.decoder = new TextDecoder('utf-8');
    }

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

    public closeConnection = (): Promise < any > => {
        networking.bluetooth.onReceiveError.removeListener(this.onReceiveError);
        this.opponentSocketId = undefined;

        if (this.ownPlayer.role === PlayerRole.Host) {
            return this.bluetoothServer.closeConnection();
        } else {
            return this.bluetoothClient.closeConnection();
        }
    }

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

    // TODO - make public and call subscribed functions with deserialised received object.
    private onReceive = (receiveInfo: any): void => {
        console.log('Data recieved:');
        console.log(receiveInfo);

        if (receiveInfo.socketId !== this.opponentSocketId) {
            console.log('Received data is on the wrong socket, should be socket ' + this.opponentSocketId + ', but was socket ' + receiveInfo.socketId);
            return;
        }
    }

    // TODO - make public and call subscribed functions with deserialised received error.
    private onReceiveError = (errorInfo: any): void => {
        console.log('A data receive error occured: ');
        console.log(errorInfo);
    }
}

