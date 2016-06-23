import { Injectable } from 'angular2/core';
import { PlayerRole } from './player-role-enum';

@Injectable()
export class OpponentPlayer {

    public role: PlayerRole;

    public characterId: number;
}
