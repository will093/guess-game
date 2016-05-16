import { Injectable } from 'angular2/core';

declare var networking: any;

@Injectable()
export class BluetoothClient {

    private serverSocketId: string = undefined;

    private isConnected: boolean = false;
    private onReceive: Function = undefined;
    private discoveryTimeout: number = 30000;
    private uuid: string = undefined;

    private resolveConnect: Function = undefined;
    private rejectConnect: Function = undefined;

    public connect = (uuid: string, onReceive: Function): Promise < string > => {

        this.uuid = uuid;
        this.onReceive = onReceive;

        let connectPromise = new Promise((resolve, reject) => {
            this.resolveConnect = resolve;
            this.rejectConnect = reject;
        });
        networking.bluetooth.requestEnable((adapterStater) => {
            networking.bluetooth.startDiscovery(() => {
                console.log('Discovering new devices...');

                networking.bluetooth.onDeviceAdded.addListener(this.onDeviceAdded);

                setTimeout(() => {
                    networking.bluetooth.stopDiscovery();
                    networking.bluetooth.onDeviceAdded.removeListener(this.onDeviceAdded);
                    this.rejectConnect('Timed out while attempting to discover devices.');
                }, this.discoveryTimeout);
            }, () => {
                console.log('Failed to start bluetooth discovery.');
                this.rejectConnect('Failed to start bluetooth discovery.');
            });
        }, () => {
            console.log('Request to enable bluetooth denied.');
            this.rejectConnect('Request to enable bluetooth denied.');
        });

        return connectPromise;
    }

    public closeConnection = (): Promise <any> => {
        return new Promise((resolve, reject) => {
            if (!this.isConnected) {
                console.log('Not connected');
                resolve();
                return;
            }

            console.log('Closing bluetooth connection on socket: ' + this.serverSocketId);

            networking.bluetooth.close(this.serverSocketId, () => {
                console.log('Succesfully disconnected from ' + this.serverSocketId);
                resolve();
            }, (errorMessage) => {
                console.log('Failed to disconnect from ' + this.serverSocketId + ':');
                console.log(errorMessage);
                reject();
            });

            this.isConnected = false;

            networking.bluetooth.onDeviceAdded.removeListener(this.onDeviceAdded);
            networking.bluetooth.onReceive.removeListener(this.onReceive);

            resolve();
        });
    }

    private onDeviceAdded = (device: any): void => {
        console.log('New device found: ');
        console.log(device);

        networking.bluetooth.connect(device.address, this.uuid, (serverSocketId) => {
            console.log('Connected to device using socket: ' + serverSocketId);

            // TODO: wait to receive some message to test that the connection was made on the right socket.

            this.serverSocketId = serverSocketId;
            this.isConnected = true;

            console.log('Bluetooth discovery stopped.');
            networking.bluetooth.stopDiscovery();

            networking.bluetooth.onDeviceAdded.removeListener(this.onDeviceAdded);
            networking.bluetooth.onReceive.addListener(this.onReceive);

            this.resolveConnect(this.serverSocketId);
        }, (errorMessage) => {
            console.log('Failed to connect to device: ' + errorMessage);
        });
    }
}

