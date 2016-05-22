import { Injectable } from 'angular2/core';
import { PlayerRole } from './player-role-enum';
import { OwnPlayer } from './own-player';
import { BluetoothServer } from './bluetooth-server';
import { BluetoothClient } from './bluetooth-client';

declare var networking: any;

@Injectable()
export class NetworkingService {

    private opponentSocketId: string;
    private successMessage: string = 'Successfully connected!';

    constructor(private ownPlayer: OwnPlayer, private bluetoothServer: BluetoothServer, private bluetoothClient: BluetoothClient) {}

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

    public send = (arrayBuffer: ArrayBuffer): void => {
        console.log('Sending data:');
        console.log(arrayBuffer);

        networking.bluetooth.send(this.opponentSocketId, arrayBuffer, (bytesSent) => {
            console.log('Sent ' + bytesSent + ' bytes');
        }, (errorMessage) => {
            console.log('Send failed: ' + errorMessage);
        });
    }

    private onReceive = (receiveInfo: any): void => {
        console.log('Data recieved:');
        console.log(receiveInfo);

        if (receiveInfo.socketId !== this.opponentSocketId) {
            console.log('Received data is on the wrong socket, should be socket ' + this.opponentSocketId + ', but was socket ' + receiveInfo.socketId);
            return;
        }
    }

    private onReceiveError = (errorInfo: any): void => {
        console.log('A data receive error occured: ');
        console.log(errorInfo);
    }
}

