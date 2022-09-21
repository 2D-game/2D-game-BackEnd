import { Player } from '../player'
import * as dto from './dto'

export class Presenter {
	static getPlayerRes(players: Set<Player>): dto.GetPlayersRes {
		return {
			users: [...players].map(player => ({
				id: player.getID(),
				username: player.getUsername()
			}))
		}
	}
}
