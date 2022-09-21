import { Player } from '../player'

export class Session {
	private id: string | null
	private readonly player: Player

	constructor(player: Player) {
		this.id = null
		this.player = player
	}

	setID(id: string) {
		this.id = id
	}

	getID(): string {
		if (this.id === null) {
			throw new Error('Session ID is not set')
		}
		return this.id
	}

	getPlayer(): Player {
		return this.player
	}
}
