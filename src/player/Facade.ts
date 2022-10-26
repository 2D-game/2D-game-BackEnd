import { Player } from './Player'
import * as dto from './'
import { Presenter } from './'
import { formatMap } from '../util/helper'
import { Levels } from '../level/Level'

const ErrNotInGame = 'Not in game'
const ErrAlreadyWon = 'Already won'

export class Facade {
	public nextLevel(player: Player): dto.MoveRes {
		const game = player.getGame()
		if (game === null) {
			throw new Error(ErrNotInGame)
		} else if (player.hasWon()) {
			throw new Error(ErrAlreadyWon)
		}

		player.incrementLevel()
		const nextLevel = player.getLevel()
		const nextMap = game.getMap(nextLevel)

		if (!nextMap || !Levels[nextLevel]) {
			player.setWon()
			return {
				id: player.getID(),
				userName: player.getUsername(),
				won: true
			}
		}

		const spawnPoint = nextMap.getSpawnPoint()
		player.setCoords(spawnPoint)

		return Presenter.getLevelChangeRes(
			player,
			game,
			formatMap(nextMap),
			Levels[nextLevel]
		)
	}
}
