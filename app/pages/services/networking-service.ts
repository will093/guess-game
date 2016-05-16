import { Injectable } from 'angular2/core';
import { PlayerRole } from './player-role-enum';
import { OwnPlayer } from './own-player';
import { BluetoothServer } from './bluetooth-server';
import { BluetoothClient } from './bluetooth-client';

declare var networking: any;

@Injectable()
export class NetworkingService {

    private opponentSocketId: string = undefined;
    private uuid: string = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
    private successMessage = 'Successfully connected!';

    constructor(private ownPlayer: OwnPlayer, private bluetoothServer: BluetoothServer, private bluetoothClient: BluetoothClient) {}

    public connect = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (this.ownPlayer.role === PlayerRole.Host) {
                this.bluetoothServer.connect(this.uuid, this.onReceive).then((clientSocketId) => {
                    this.opponentSocketId = clientSocketId;
                    resolve(this.successMessage);
                }, (errorMessage) => {
                    reject(errorMessage);
                });
            } else {
                this.bluetoothClient.connect(this.uuid, this.onReceive).then((serverSocketId) => {
                    this.opponentSocketId = serverSocketId;
                    resolve(this.successMessage);
                }, (errorMessage) => {
                    reject(errorMessage);
                });
            }

            networking.bluetooth.onReceiveError.addListener(this.onReceiveError);
        });
    }

    public send = (arrayBuffer: ArrayBuffer): void => {
        networking.bluetooth.send(this.opponentSocketId, arrayBuffer, (bytesSent) => {
            console.log('Sent ' + bytesSent + ' bytes');
        }, (errorMessage) => {
            console.log('Send failed: ' + errorMessage);
        });
    }

    public closeConnection = (): void => {
        if (this.ownPlayer.role === PlayerRole.Host) {
            this.bluetoothServer.closeConnection();
        } else {
            this.bluetoothClient.closeConnection();
        }

        networking.bluetooth.onReceiveError.removeListener(this.onReceiveError);
        this.opponentSocketId = undefined;
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

