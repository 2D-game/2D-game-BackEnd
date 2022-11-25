import { IPublisher } from '../util/Observer'
import { Player } from './Player'

export enum Event {
	PLAYER_CREATED = 'PLAYER_CREATED',
	PLAYER_DISCONNECTED = 'PLAYER_DISCONNECTED',
	PLAYER_READY = 'PLAYER_READY',
	PLAYER_SCORE_CHANGE = 'PLAYER_SCORE_CHANGE',
}

export class Publisher extends IPublisher<Event, Player> {
	constructor() {
		super()
	}
}
