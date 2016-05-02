import {Injectable} from 'angular2/core';
import {Message} from './message';

@Injectable()
export class MessageService {

	sendMessage(message: Message) {}

	closeConnection() {}
}