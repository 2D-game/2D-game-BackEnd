import { Lobby } from './Lobby'
import { EventBus as AEventBus } from '../util/EventBus'

export enum Event {
	NEW_PLAYER = 'NEW_PLAYER',
}

export class EventBus extends AEventBus<Event, Lobby> {
	constructor() {
		super()
	}
}
