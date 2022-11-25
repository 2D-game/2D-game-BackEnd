import { Map } from '../'
import { Game } from '../../game'
import { Publisher as MapPublisher } from '../Publisher'
import { Publisher as PlayerPublisher } from '../../player'

export interface IBuilder {
	addWalls(): IBuilder;

	addLava(): IBuilder;

	addWater(): IBuilder;

	addItems(game: Game, level: number, mapPub: MapPublisher, playerPub: PlayerPublisher): IBuilder;

	build(): Map
}
