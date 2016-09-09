import { Injectable } from '@angular/core';

export interface IPlayer {

    role: PlayerRole;

    characterId: string;
}

@Injectable()
export class OpponentPlayer implements IPlayer {

    public role: PlayerRole;

    public characterId: string;
}

@Injectable()
export class OwnPlayer implements IPlayer {

    public role: PlayerRole;

    public characterId: string;
}

export enum PlayerRole {
    Host = 1,
    Opponent
}
