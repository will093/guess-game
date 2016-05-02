import {Injectable} from 'angular2/core';
import {MessageType} from './message-type-enum.ts'

export class Message {

	messageType: MessageType;

	data: any;
}