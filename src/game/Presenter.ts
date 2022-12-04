import { createLevel, Level } from '../level/Level'
import * as dto from './dto'
import { Game } from './'
import { Map } from '../map'
import { Player } from '../player'

export class Presenter {
	public static formatMap(map: Map): dto.Map {
		const height = map.getHeight()
		const width = map.getWidth()
		const objects = new Array(height)
		for (let i = 0; i < height; i++) {
			objects[i] = new Array(width)
			for (let j = 0; j < width; j++) {
				const obj = map.getObjectAt({ x: j, y: i })
				if (obj === null) {
					continue
				}
				objects[i][j] = obj.getType()
			}
		}

		return {
			height: map.getHeight(),
			width: map.getWidth(),
			spawnPoint: map.getSpawnPoint(),
			objects: objects
		}
	}

	static getStartRes(game: Game, level: Level): dto.StartRes {
		return {
			map: this.formatMap(game.getMap(0)),
			colors: createLevel(level)
		}
	}

	static getPlayersRes(players: Set<Player>): dto.GetPlayersRes {
		return {
			users: [...players].map((player) => ({
				id: player.getID(),
				username: player.getUsername(),
				level: player.getLevel(),
				coords: player.getCoords(),
				image: player.getImage()
			}))
		}
	}
}
