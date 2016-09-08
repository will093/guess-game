import { Injectable } from 'angular2/core';
import { BluetoothConfig } from './bluetooth-config';

declare var networking: any;

@Injectable()
export class BluetoothServer {

    private isConnected: boolean = false;

    private serverSocketId: string;
    private clientSocketId: string;

    private onReceive: Function;

    private connectionWaitTimer: number;

    private resolveConnect: Function;
    private rejectConnect: Function;

    constructor(private config: BluetoothConfig) {}

    public connect = (onReceive: Function): Promise < string > => {
        console.log('Connecting...');

        this.onReceive = onReceive;

        let connectPromise = new Promise((resolve, reject) => {
            this.resolveConnect = resolve;
            this.rejectConnect = reject;

            this.connectionWaitTimer = setTimeout(() => {
                this.cancelConnect('Timed out waiting for opponent.');
            }, this.config.connectionWaitTimeout);
        });

        networking.bluetooth.getAdapterState((adapterInfo) => {
            if (adapterInfo.discoverable) {
                this.listenForConnections();
            } else {
                networking.bluetooth.requestDiscoverable(() => {
                    this.listenForConnections();
                }, () => {
                    this.cancelConnect('Request to make discoverable denied.');
                });
            }
        }, (errorMessage) => {
            this.cancelConnect(errorMessage);
        });

        return connectPromise;
    }

    private listenForConnections = (): Promise < any > => {
        return networking.bluetooth.listenUsingRfcomm(this.config.uuid, (serverSocketId) => {
            console.log('Listening for connections on server socket: ' + serverSocketId);

            this.serverSocketId = serverSocketId;

            networking.bluetooth.onAccept.addListener(this.onAccept);
        }, (errorMessage) => {
            this.cancelConnect('Failed to publish bluetooth service: ' + errorMessage);
        });
    }

    public closeConnection = (): Promise < any > => {
        return new Promise((resolve, reject) => {
            console.log('Closing bluetooth connection...');

            networking.bluetooth.onReceive.removeListener(this.onReceive);
            networking.bluetooth.onAccept.removeListener(this.onAccept);

            window.clearTimeout(this.connectionWaitTimer);

            if (!this.serverSocketId) {
                this.isConnected = false;
                resolve();
            }

            networking.bluetooth.close(this.serverSocketId, () => {
                this.isConnected = false;
                resolve();
            }, (errorMessage) => {
                console.log('Failed to unpublish service on socket ' + this.serverSocketId + ': ' + errorMessage);
                reject();
            });
        });

    }

    private onAccept = (acceptInfo: any): void => {

        console.log('Accepted a connection!');

        if (acceptInfo.socketId !== this.serverSocketId) {
            this.cancelConnect('Accepted connection is on the wrong socket, should be socket ' + this.serverSocketId + ', but was socket ' + acceptInfo.socketId);
            return;
        }

        networking.bluetooth.send(acceptInfo.clientSocketId, this.config.confirmationMessageView.buffer, () => {
            console.log('Confirmation message sent to socket: ' + acceptInfo.clientSocketId);
        }, (errorMessage) => {
            this.cancelConnect('Failed to send confirmation message: ' + errorMessage);
        });

        this.clientSocketId = acceptInfo.clientSocketId;

        networking.bluetooth.onAccept.removeListener(this.onAccept);
        window.clearTimeout(this.connectionWaitTimer);

        networking.bluetooth.onReceive.addListener(this.onReceive);

        this.isConnected = true;
        this.resolveConnect(this.clientSocketId);
    }

    private cancelConnect = (reason: string) => {
        console.log(reason);
        this.closeConnection().then(() => {
            this.rejectConnect(reason);
        }, () => {
            this.rejectConnect(reason);
        });
    };
}

