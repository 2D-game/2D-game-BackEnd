import { Map } from '../'
import { Game } from '../../game'
import { Publisher } from '../Publisher'

export interface IBuilder {
	addWalls(): IBuilder;

	addLava(): IBuilder;

	addWater(): IBuilder;

	addItems(game: Game, level: number, pub: Publisher): IBuilder;

	build(): Map
}
