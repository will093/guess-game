import { Injectable } from 'angular2/core';
import { BluetoothConfig } from './bluetooth-config';
import * as _ from 'lodash';

declare var networking: any;

@Injectable()
export class BluetoothClient {

    private isConnected: boolean = false;

    private serverSocketId: string;

    private onReceive: Function;

    private discoveryTimer: number;
    private confirmationTimer: number;

    private resolveConnect: Function;
    private rejectConnect: Function;

    constructor(private config: BluetoothConfig) {}

    public connect = (onReceive: Function): Promise < string > => {
        console.log('Connecting...');

        this.onReceive = onReceive;

        let connectPromise = new Promise((resolve, reject) => {
            this.resolveConnect = resolve;
            this.rejectConnect = reject;
        });

        networking.bluetooth.requestEnable((adapterStater) => {
            networking.bluetooth.startDiscovery(() => {
                console.log('Discovering new devices...');

                networking.bluetooth.onDeviceAdded.addListener(this.onDeviceAdded);

                this.discoveryTimer = setTimeout(this.onDiscoveryTimeout, this.config.discoveryTimeout);
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

            console.log('Closing bluetooth connection on socket: ' + this.serverSocketId);

            networking.bluetooth.stopDiscovery();

            networking.bluetooth.onDeviceAdded.removeListener(this.onDeviceAdded);
            networking.bluetooth.onReceive.removeListener(this.onReceive);
            networking.bluetooth.onReceive.removeListener(this.onReceiveConfirmation);

            window.clearTimeout(this.discoveryTimer);
            window.clearTimeout(this.confirmationTimer);

            if (!this.serverSocketId) {
                this.isConnected = false;
                resolve();
            }

            networking.bluetooth.close(this.serverSocketId, () => {
                this.isConnected = false;
                resolve();
            }, (errorMessage) => {
                console.log('Failed to disconnect from ' + this.serverSocketId + ': ' + errorMessage);
                reject();
            });
        });
    }

    private onDeviceAdded = (device: any): void => {
        console.log('New device found: ');
        console.log(device);

        networking.bluetooth.connect(device.address, this.config.uuid, (serverSocketId) => {
            console.log('Connected to device using socket: ' + serverSocketId);

            this.serverSocketId = serverSocketId;

            networking.bluetooth.stopDiscovery();
            window.clearTimeout(this.discoveryTimer);

            networking.bluetooth.onDeviceAdded.removeListener(this.onDeviceAdded);

            // Wait to receive some message to confirm that the connection was made on the right socket.
            networking.bluetooth.onReceive.addListener(this.onReceiveConfirmation);
            this.confirmationTimer = setTimeout(this.onConfirmationTimeout, this.config.confirmationTimeout);
        }, (errorMessage) => {
            console.log('Failed to connect to device: ' + errorMessage);
        });
    }

    private onReceiveConfirmation = (receiveInfo: any) => {
        let receivedMessageView = new Uint8Array(receiveInfo.data);

        if (_.isEqual(receivedMessageView, this.config.confirmationMessageView)) {
            console.log('Server has confirmed connection success!');
            networking.bluetooth.onReceive.removeListener(this.onReceiveConfirmation);
            window.clearTimeout(this.confirmationTimer);

            networking.bluetooth.onReceive.addListener(this.onReceive);
            this.isConnected = true;
            this.resolveConnect(this.serverSocketId);
        } else {
            this.cancelConnect('Server connection confirmation message was not of the expected format.');
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
            this.rejectConnect(reason);
        }, () => {
            this.rejectConnect(reason);
        });
    };
}

