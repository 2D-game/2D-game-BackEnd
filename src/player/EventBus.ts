import { EventBus as AEventBus } from '../util/EventBus'
import { Player } from './Player'

export enum Event {
	PLAYER_CREATED = 'PLAYER_CREATED',
	PLAYER_DISCONNECTED = 'PLAYER_DISCONNECTED',
}

export class EventBus extends AEventBus<Event, Player> {
	constructor() {
		super()
	}
}
