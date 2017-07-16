import { Injectable } from '@angular/core';
import { BluetoothConfig } from './bluetooth-config';
import { isEqual } from 'lodash';

declare var networking: any;

@Injectable()
export class BluetoothClient {

    private _isConnected: boolean = false;

    private _serverSocketId: string;

    private _onReceive: Function;

    private _discoveryTimer: any;
    private _confirmationTimer: any;

    private _resolveConnect: Function;
    private _rejectConnect: Function;

    constructor(private config: BluetoothConfig) {}

    public connect = (onReceive: Function): Promise < string > => {
        console.log('Connecting...');

        this._onReceive = onReceive;

        let connectPromise = new Promise((resolve, reject) => {
            this._resolveConnect = resolve;
            this._rejectConnect = reject;
        });

        networking.bluetooth.requestEnable((adapterStater) => {
            networking.bluetooth.startDiscovery(() => {
                console.log('Discovering new devices...');

                networking.bluetooth.onDeviceAdded.addListener(this.onDeviceAdded);

                this._discoveryTimer = setTimeout(this.onDiscoveryTimeout, this.config.discoveryTimeout);
            }, () => {
                this.cancelConnect('Failed to start bluetooth discovery.');
            });
        }, () => {
            this.cancelConnect('Request to enable bluetooth denied.');
        });

        return connectPromise;
    }

    public closeConnection = (): Promise < any > => {
        return new Promise((resolve, reject) => {

            console.log('Closing bluetooth connection on socket: ' + this._serverSocketId);

            networking.bluetooth.stopDiscovery();

            networking.bluetooth.onDeviceAdded.removeListener(this.onDeviceAdded);
            networking.bluetooth.onReceive.removeListener(this._onReceive);
            networking.bluetooth.onReceive.removeListener(this.onReceiveConfirmation);

            window.clearTimeout(this._discoveryTimer);
            window.clearTimeout(this._confirmationTimer);

            if (!this._serverSocketId) {
                this._isConnected = false;
                resolve();
            }

            networking.bluetooth.close(this._serverSocketId, () => {
                this._isConnected = false;
                resolve();
            }, (errorMessage) => {
                console.log('Failed to disconnect from ' + this._serverSocketId + ': ' + errorMessage);
                reject();
            });
        });
    }

    private onDeviceAdded = (device: any): void => {
        console.log('New device found: ');
        console.log(device);

        networking.bluetooth.connect(device.address, this.config.uuid, (_serverSocketId) => {
            console.log('Connected to device using socket: ' + _serverSocketId);

            this._serverSocketId = _serverSocketId;

            networking.bluetooth.stopDiscovery();
            window.clearTimeout(this._discoveryTimer);

            networking.bluetooth.onDeviceAdded.removeListener(this.onDeviceAdded);

            // Wait to receive some message to confirm that the connection was made on the right socket.
            networking.bluetooth.onReceive.addListener(this.onReceiveConfirmation);
            this._confirmationTimer = setTimeout(this.onConfirmationTimeout, this.config.confirmationTimeout);
        }, (errorMessage) => {
            console.log('Failed to connect to device: ' + errorMessage);
        });
    }

    private onReceiveConfirmation = (receiveInfo: any) => {
        let receivedMessageView = new Uint8Array(receiveInfo.data);

        // Compare first 8 bytes as we seem to be getting other stuff through too.
        if (isEqual(receivedMessageView.subarray(0, 8), this.config.confirmationMessageView)) {
            console.log('Server has confirmed connection success!');
            networking.bluetooth.onReceive.removeListener(this.onReceiveConfirmation);
            window.clearTimeout(this._confirmationTimer);

            networking.bluetooth.onReceive.addListener(this._onReceive);
            this._isConnected = true;
            this._resolveConnect(this._serverSocketId);
        } else {
            this.cancelConnect('Server connection confirmation message was not of the expected format.');
            console.log('Expected: ');
            console.log(this.config.confirmationMessageView);
            console.log('Received: ');
            console.log(receivedMessageView);
        }
    }

    private onDiscoveryTimeout = () => {
        networking.bluetooth.stopDiscovery();
        networking.bluetooth.onDeviceAdded.removeListener(this.onDeviceAdded);
        this.cancelConnect('Timed out while attempting to discover devices.');
    }

    private onConfirmationTimeout = () => {
        this.cancelConnect('Timed out waiting for server to confirm connection.');
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

