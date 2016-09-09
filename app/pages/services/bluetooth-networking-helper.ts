import { Injectable } from '@angular/core';
import { Character } from './character';
import { OwnPlayer, PlayerRole } from './player';
import { BluetoothNetworkingService } from './bluetooth/bluetooth-networking-service';

// Service for abstracting the process of networking from the game's business logic.
@Injectable()
export class BluetoothNetworkingHelper {

    constructor(private networkingService: BluetoothNetworkingService, private ownPlayer: OwnPlayer) {}

    public connect(): Promise<string> {
        if (this.ownPlayer.role === PlayerRole.Host) {
            return this.networkingService.connectAsServer();
        } else if (this.ownPlayer.role === PlayerRole.Opponent) {
            return this.networkingService.connectAsClient();
        }
    }

    public closeConnection(): Promise<any> {
        if (this.ownPlayer.role === PlayerRole.Host) {
            return this.networkingService.closeConnectionAsServer();
        } else if (this.ownPlayer.role === PlayerRole.Opponent) {
            return this.networkingService.closeConnectionAsClient();
        }
    }
    
}

