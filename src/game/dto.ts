// Start
import { Type } from '../object'
import { SpawnPoint } from '../map'

export type StartRes = {
	map: {
		height: number
		width: number
		spawnPoint: SpawnPoint
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
