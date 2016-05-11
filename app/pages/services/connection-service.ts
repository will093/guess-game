import { Injectable } from 'angular2/core';
import { PlayerRole } from './player-role-enum';
import { OwnPlayer } from './own-player';

@Injectable()
export class ConnectionService {

    private uuid: string = '94f39d29-7d6d-437d-973b-fba39e49d4ee';
    private serverSocketId: string = null;
    private opponentSocketId: string = null;
    public isConnected: boolean = false;

    constructor(private ownPlayer: OwnPlayer) {}

    public initialiseConnection = () => {

        if (this.isConnected) {
            return true;
        }

        if (this.ownPlayer.role === PlayerRole.Host) {
            this.initialiseConnectionAsServer();
        } else {
            this.initialiseConnectionAsClient();
        };

        networking.bluetooth.onReceiveError.addListener((errorInfo) => {

            if (errorInfo.socketId !== this.serverSocketId) {
                return;
            }

            console.log('A data receive error occured: ');
            console.log(errorInfo);
        });

        return this.isConnected;
    }

    private initialiseConnectionAsServer = () => {
        networking.bluetooth.requestDiscoverable(() => {
            networking.bluetooth.listenUsingRfcomm(this.uuid, (serverSocketId) => {
                console.log('Listening for connections on server socket: ' + serverSocketId);

                this.serverSocketId = serverSocketId;
                networking.bluetooth.onAccept.addListener((acceptInfo) => {

                    if (acceptInfo.socketId !== this.serverSocketId) {
                        console.log('Accpeted connection is on the wrong socket: ');
                        console.log(acceptInfo);
                        return;
                    }

                    console.log('Accepted a connection!');
                    console.log(acceptInfo);

                    this.opponentSocketId = acceptInfo.clientSocketId;
                    this.isConnected = true;

                    networking.bluetooth.onReceive.addListener((receiveInfo) => {

                        if (receiveInfo.socketId !== this.opponentSocketId) {
                            console.log('Data received on the wrong socket: ');
                            console.log(receiveInfo);
                            return;
                        }
                        console.log('Data recieved:');
                        console.log(receiveInfo);
                    });
                });
            }, (errorMessage) => {
                console.error(errorMessage);
            });

        }, () => {
            console.log('Request to make discoverable denied.')
        });
    }

    private initialiseConnectionAsClient = () => {
        networking.bluetooth.startDiscovery(() => {
            networking.bluetooth.onDeviceAdded.addListener((device) => {
                console.log('New device found: ');
                console.log(device);

                networking.bluetooth.connect(device.address, this.uuid, (serverSocketId) => {
                    console.log('Connected to device using socket: ' + serverSocketId);

                    this.serverSocketId = serverSocketId;
                    this.opponentSocketId = this.serverSocketId;
                    this.isConnected = true;

                    networking.bluetooth.onReceive.addListener((receiveInfo) => {

                        if (receiveInfo.socketId !== this.opponentSocketId) {
                            console.log('Data received on the wrong socket: ');
                            console.log(receiveInfo);
                            return;
                        }
                        console.log('Data recieved:');
                        console.log(receiveInfo);
                    });
                }, (errorMessage) => {
                    console.log('Failed to connect to device: ' + errorMessage);
                });
            });

            setTimeout(() => {
                networking.bluetooth.stopDiscovery();
                console.log('Bluetooth discovery stopped.');
            }, 15000);
        });
    }

    public send = (arrayBuffer: ArrayBuffer) => {
        networking.bluetooth.send(this.opponentSocketId, arrayBuffer, (bytes_sent) => {
            console.log('Sent ' + bytes_sent + ' bytes');
        }, (errorMessage) => {
            console.log('Send failed: ' + errorMessage);
        });
    }

    public closeConnection = () => {
        console.log('Closing bluetooth connection on socket: ' + this.serverSocketId);
        networking.bluetooth.close(this.serverSocketId);
        this.serverSocketId = null;
        this.isConnected = false;
    }
}
