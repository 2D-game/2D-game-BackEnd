import { EventBus as AEventBus } from '../util/EventBus'
import { Lobby } from './Lobby'

export enum Event {
	PLAYER_LIST_CHANGE = 'PLAYER_LIST_CHANGE',
}

export class EventBus extends AEventBus<Event, Lobby> {
	constructor() {
		super()
	}
}
