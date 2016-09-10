import { Injectable } from '@angular/core';
import { IEvent, Event} from './event';
import { BluetoothNetworkingService } from './bluetooth/bluetooth-networking-service';
import { IMessage, MessageType, StartGameMessage, EndGameMessage } from './message';

// Service for abstracting the process of sending and receiving game data between the 2 devices over a network.
@Injectable()
export class MessageService {

    public constructor(private networkingService: BluetoothNetworkingService) {
        networkingService.onDataReceived.subscribe(this.dataReceived);
    }

    // Sends a message to the other device to start a new game.
    public startNewGame = (ownCharacterId: string, opponentCharacterId: string, isOwnTurn: boolean): void => {

        var message: StartGameMessage = {
            messageType: MessageType.StartGame,
            receiverCharacterId: opponentCharacterId,
            senderCharacterId: ownCharacterId,
            isReceiverTurn: !isOwnTurn,
        };

        console.log('Sending start game message:');
        console.log(message);

        this.networkingService.send(message);
    }

    // Inform the other device that the current player's turn has ended.
    public endTurn = (): void => {
        var message: IMessage = {
            messageType: MessageType.EndTurn,
        };
        this.networkingService.send(message);
    }

    // Inform the other device that the game has ended.
    public endGame = (victory: boolean): void => {
        var message: EndGameMessage = {
            messageType: MessageType.EndGame,
            receiverWins: !victory,
        };
        this.networkingService.send(message);
    }

    public onStartGame: IEvent<StartGameMessage> = new Event<StartGameMessage>();

    public onEndTurn: IEvent<void> = new Event<void>();

    public onEndGame: IEvent<EndGameMessage> = new Event<EndGameMessage>();

    // Fires appropriate events when data is received from the other device.
    private dataReceived = (data): void => {

        switch (data.messageType) {
            case MessageType.StartGame:
                this.onStartGame.trigger(data as StartGameMessage);
                break;
            case MessageType.EndTurn: 
                this.onEndTurn.trigger();
                break;
            case MessageType.EndGame:
                this.onEndGame.trigger(data as EndGameMessage);
                break;
            default:
                console.log('Invalid message received:');
                console.log(data);
        }

    }
}
