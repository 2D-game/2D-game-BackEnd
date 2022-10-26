import { Player } from './Player'
import * as dto from './'
import { Presenter } from './'
import { formatMap } from '../util/helper'
import { Levels } from '../level/Level'

const ErrNotInGame = 'Not in game'

export class Facade {
	public nextLevel(player: Player): dto.MoveRes {
		const game = player.getGame()
		if (game === null) {
			throw new Error(ErrNotInGame)
		}

		player.incrementLevel()
		const level = player.getLevel()
		const spawnPoint = game.getMap(level).getSpawnPoint()
		player.setCoords(spawnPoint)

		return Presenter.getLevelChangeRes(
			player,
			game,
			formatMap(game.getMap(level)),
			Levels[level]
		)
	}
}
