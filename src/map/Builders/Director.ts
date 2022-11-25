import { Map } from '../Map'
import { Map1Builder } from './Map1Builder'
import { Map2Builder } from './Map2Builder'
import { Map3Builder } from './Map3Builder'
import { Game } from '../../game'
import { Publisher as MapPublisher } from '../Publisher'
import { Publisher as PlayerPublisher } from '../../player'

export class Director {
	public static CreateMap1(map: Map, game: Game, level: number, mapPub: MapPublisher, playerPub: PlayerPublisher): Map {
		return new Map1Builder(map)
			.addWalls()
			.addLava()
			.addWater()
			.addItems(game, level, mapPub, playerPub)
			.build()
	}

	public static CreateMap2(map: Map, game: Game, level: number, mapPub: MapPublisher, playerPub: PlayerPublisher): Map {
		return new Map2Builder(map)
			.addWalls()
			.addLava()
			.addWater()
			.addItems(game, level, mapPub, playerPub)
			.build()
	}

	public static CreateMap3(map: Map, game: Game, level: number, mapPub: MapPublisher, playerPub: PlayerPublisher): Map {
		return new Map3Builder(map)
			.addWalls()
			.addLava()
			.addWater()
			.addItems(game, level, mapPub, playerPub)
			.build()
	}
}
