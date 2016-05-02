import {Injectable} from 'angular2/core';
import {Character} from './character';


@Injectable()
export class Game {

	characters: Array<Character>;

}