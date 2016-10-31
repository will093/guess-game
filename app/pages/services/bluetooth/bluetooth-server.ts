import { Injectable } from '@angular/core';
import { BluetoothConfig } from './bluetooth-config';

declare var networking: any;

@Injectable()
export class BluetoothServer {

    private _isConnected: boolean = false;

    private _serverSocketId: string;
    private _clientSocketId: string;

    private _onReceive: Function;

    private _connectionWaitTimer: any;

    private _resolveConnect: Function;
    private _rejectConnect: Function;

    constructor(private config: BluetoothConfig) {}

    public connect = (onReceive: Function): Promise < string > => {
        console.log('Connecting...');

        this._onReceive = onReceive;

        let connectPromise = new Promise((resolve, reject) => {
            this._resolveConnect = resolve;
            this._rejectConnect = reject;

            this._connectionWaitTimer = setTimeout(() => {
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

            this._serverSocketId = serverSocketId;

            networking.bluetooth.onAccept.addListener(this.onAccept);
        }, (errorMessage) => {
            this.cancelConnect('Failed to publish bluetooth service: ' + errorMessage);
        });
    }

    public closeConnection = (): Promise < any > => {
        return new Promise((resolve, reject) => {
            console.log('Closing bluetooth connection on server socket:', this._serverSocketId);

            networking.bluetooth.onReceive.removeListener(this._onReceive);
            networking.bluetooth.onAccept.removeListener(this.onAccept);
            window.clearTimeout(this._connectionWaitTimer);

            if (!this._serverSocketId) {
                this._isConnected = false;
                resolve();
            }

            // Disconnect from client socket, and then close server socket.
            networking.bluetooth.close(this._clientSocketId, () => {
                networking.bluetooth.close(this._serverSocketId, () => {
                    this._isConnected = false;
                    resolve();
                }, (errorMessage) => {
                    console.log('Failed to unpublish service on socket ' + this._serverSocketId + ': ' + errorMessage);
                    reject();
                });
            });
        });

    }

    private onAccept = (acceptInfo: any): void => {

        console.log('Accepted a connection!');

        if (acceptInfo.socketId !== this._serverSocketId) {
            this.cancelConnect('Accepted connection is on the wrong socket, should be socket ' + this._serverSocketId + ', but was socket ' + acceptInfo.socketId);
            return;
        }

        networking.bluetooth.send(acceptInfo.clientSocketId, this.config.confirmationMessageView.buffer, () => {
            console.log('Confirmation message sent to socket: ' + acceptInfo.clientSocketId);
            console.log(this.config.confirmationMessageView);

            // TODO: this is required so that next message sent via bluetooth doesn't get mangled with the confirmation message.
            setTimeout(() => {
                this._clientSocketId = acceptInfo.clientSocketId;

                networking.bluetooth.onAccept.removeListener(this.onAccept);
                window.clearTimeout(this._connectionWaitTimer);

                networking.bluetooth.onReceive.addListener(this._onReceive);

                this._isConnected = true;
                this._resolveConnect(this._clientSocketId);
            }, this.config.postConfirmationWaitTimeout);

        }, (errorMessage) => {
            this.cancelConnect('Failed to send confirmation message: ' + errorMessage);
        });
    }

    private cancelConnect = (reason: string) => {
        console.log(reason);
        this.closeConnection().then(() => {
            this._rejectConnect(reason);
        }, () => {
            this._rejectConnect(reason);
        });
    };
}
