import { Injectable } from '@angular/core';
import { OwnPlayer, PlayerRole } from '../models/player';
import { BluetoothNetworkingService } from './bluetooth/bluetooth-networking-service';

// Service for abstracting the process of networking from the game's business logic.
@Injectable()
export class BluetoothNetworkingHelper {

    constructor(private _networkingService: BluetoothNetworkingService, private _ownPlayer: OwnPlayer) {}

    public connect(): Promise<string> {
        if (this._ownPlayer.role === PlayerRole.Host) {
            return this._networkingService.connectAsServer();
        } else if (this._ownPlayer.role === PlayerRole.Opponent) {
            return this._networkingService.connectAsClient();
        }
    }

    public closeConnection(): Promise<any> {
        if (this._ownPlayer.role === PlayerRole.Host) {
            return this._networkingService.closeConnectionAsServer();
        } else if (this._ownPlayer.role === PlayerRole.Opponent) {
            return this._networkingService.closeConnectionAsClient();
        }
    }
    
}

