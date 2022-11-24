import { IPublisher } from '../util/Observer'
import { Map } from './Map'
import { Game } from '../game'

export enum Event {
	MAP_CHANGE = 'MAP_CHANGE'
}

export type MapChange = {
	map: Map
	game: Game
}

export class Publisher extends IPublisher<Event, MapChange> {
	constructor() {
		super()
	}
}
