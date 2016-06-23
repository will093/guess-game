import { Injectable } from 'angular2/core';
import { MessageType } from './message-type-enum.ts';

@Injectable
export class Message {

    public messageType: MessageType;

    public data: any;
}
