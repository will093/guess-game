export interface IMessage {
    messageType: MessageType;
}

export class StartGameMessage implements IMessage {

    public messageType: MessageType;

    // Character of player to receive this message.
    public receiverCharacterId: string;

    // Character of player who sends this message.
    public senderCharacterId: string;

    // Whether the player who receives this message has the first turn.
    public isReceiverTurn: boolean;
}

export class EndGameMessage implements IMessage {

    public messageType: MessageType;

    // Character of player to receive this message.
    public receiverWins: boolean;
}

export enum MessageType {
    StartGame = 1,
    EndTurn = 2,
    EndGame = 3,
}
