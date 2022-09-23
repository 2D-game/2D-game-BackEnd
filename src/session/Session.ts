import { Player } from '../player'
import * as crypto from 'crypto'

export class Session {
	private readonly id: string
	private readonly player: Player

	constructor(player: Player) {
		this.id = crypto.randomUUID()
		this.player = player
	}

	getID(): string {
		return this.id
	}

	getPlayer(): Player {
		return this.player
	}
}
