import {Injectable} from 'angular2/core';
import {PlayerRole} from './player-role-enum';

@Injectable()
export class OwnPlayer {

    public role: PlayerRole = undefined;

    public characterId: number = undefined;

    public isPlayerTurn: boolean = undefined;
}
