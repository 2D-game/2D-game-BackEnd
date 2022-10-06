import { IPublisher } from '../util/Observer'
import { Game } from './'

export enum Event {
	PLAYER_LIST_CHANGE = 'PLAYER_LIST_CHANGE'
}

export class Publisher extends IPublisher<Event, Game> {
	constructor() {
		super()
	}
}
