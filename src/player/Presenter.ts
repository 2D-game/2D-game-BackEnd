import { Level } from '../level/Level'
import { Game, Map } from '../game'
import { createLevel } from '../level/Level'
import * as dto from './dto'
import { Player } from './Player'

export class Presenter {
	static getMoveRes(player: Player): dto.MoveRes {
		return {
			id: player.getID(),
			level: player.getLevel(),
			coords: player.getCoords()
		}
	}

	static getLevelChangeRes(
		player: Player,
		game: Game,
		map: Map,
		level: Level
	): dto.MoveRes {
		return {
			id: player.getID(),
			level: player.getLevel(),
			coords: game.getMap(player.getLevel()).getSpawnPoint(),
			map: map,
			userName: player.getUsername(),
			colors: createLevel(level)
		}
	}
}
