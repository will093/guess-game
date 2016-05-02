import { Injectable } from 'angular2/core';
import { PlayerRole } from './player-role-enum';
import { OwnPlayer } from './own-player';

@Injectable()
export class ConnectionService {

    constructor(private ownPlayer: OwnPlayer) {}

    initialiseConnection() {
        if (this.ownPlayer.role === PlayerRole.Host) {
            networking.bluetooth.requestDiscoverable(function() {
                // The device is now discoverable 
            }, function() {
                // The user has cancelled the operation 
            });
        } else {
            // Now begin the discovery process. 
            networking.bluetooth.startDiscovery(function() {
                // Stop discovery after 5 seconds. 
                setTimeout(function() {
                    networking.bluetooth.stopDiscovery();
                    networking.bluetooth.getDevices(function(devices) {
                    	console.log(devices);
                    });
                }, 10000);
            });
        };
    }

    closeConnection() {}
}
