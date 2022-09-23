// Start
import { Type } from '../object'

export type StartRes = {
	map: {
		height: number
		width: number
		objects: Type[][]
	}
}

// GetPlayers
export type GetPlayersRes = {
	users: {
		id: string
		username: string
	}[]
}
