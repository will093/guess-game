import { Injectable } from 'angular2/core';
import { Message } from './message';

@Injectable()
export class MessageService {

    public startGame = (): void => {}

    public endTurn = (): void => {}

    public endGame = (): void => {}

    public onStartGame = (): void => {}

    public onEndTurn = (): void => {}

    public onEndGame = (): void => {}
}
