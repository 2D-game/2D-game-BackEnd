import { EventBus as AEventBus } from '../util/EventBus'
import { Game } from './'

export enum Event {
	PLAYER_LIST_CHANGE = 'PLAYER_LIST_CHANGE'
}

export class EventBus extends AEventBus<Event, Game> {
	constructor() {
		super()
	}
}
