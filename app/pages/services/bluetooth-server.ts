import { Injectable } from 'angular2/core';

declare var networking: any;

@Injectable()
export class BluetoothServer {

    private serverSocketId: string = undefined;
    private clientSocketId: string = undefined;

    private isConnected: boolean = false;
    private onReceive: Function = undefined;
    private timeout: number = 60000;

    private resolveConnect: Function = undefined;
    private rejectConnect: Function = undefined;

    public connect = (uuid: string, onReceive: Function): Promise < string > => {

        this.onReceive = onReceive;

        let connectPromise = new Promise((resolve, reject) => {
            this.resolveConnect = resolve;
            this.rejectConnect = reject;

            setTimeout(() => {
                this.rejectConnect('Timed out waiting for opponent.');
            }, this.timeout);
        });

        networking.bluetooth.requestDiscoverable(() => {
            networking.bluetooth.listenUsingRfcomm(uuid, (serverSocketId) => {
                console.log('Listening for connections on server socket: ' + serverSocketId);

                this.serverSocketId = serverSocketId;

                networking.bluetooth.onAccept.addListener(this.onAccept);
            }, (errorMessage) => {
                console.error(errorMessage);
                this.rejectConnect('Failed to publish bluetooth service.');
            });

        }, () => {
            console.log('Request to make discoverable denied.');
            this.rejectConnect('Request to make device discoverable denied.');
        });

        return connectPromise;
    }

    public closeConnection = (): Promise < any > => {
        return new Promise((resolve, reject) => {

            if (!this.isConnected) {
                console.log('Not connected');
                resolve();
                return;
            }

            console.log('Closing bluetooth connection on socket: ' + this.serverSocketId);

            networking.bluetooth.close(this.serverSocketId, () => {
                console.log('Succesfully unpublished service on socket ' + this.serverSocketId);

                this.isConnected = false;

                networking.bluetooth.onReceive.removeListener(this.onReceive);
                networking.bluetooth.onAccept.removeListener(this.onAccept);
                resolve();
            }, (errorMessage) => {
                console.log('Failed to unpublish service on socket ' + this.serverSocketId + ':');
                console.log(errorMessage);
                reject();
            });
        });

    }

    private onAccept = (acceptInfo: any): void => {
        console.log('Accepted a connection!');
        console.log(acceptInfo);

        if (acceptInfo.socketId !== this.serverSocketId) {
            console.log('Accepted connection is on the wrong socket, should be socket ' + this.serverSocketId + ', but was socket ' + acceptInfo.socketId);
            this.rejectConnect('A device attempted to connect on the wrong socket.');
            return;
        }

        // TODO: send some message to client to confirm that connection was made on the right socket.

        this.clientSocketId = acceptInfo.clientSocketId;
        this.isConnected = true;
        networking.bluetooth.onAccept.removeListener(this.onAccept);
        networking.bluetooth.onReceive.addListener(this.onReceive);
        this.resolveConnect(this.clientSocketId);
    }
}

