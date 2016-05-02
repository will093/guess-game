import {Injectable} from 'angular2/core';
import {PlayerRole} from './player-role-enum';

@Injectable()
export class OwnPlayer {

	role: PlayerRole;

	characterId: number;

	isPlayerTurn: boolean;
}