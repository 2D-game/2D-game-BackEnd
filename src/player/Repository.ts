import { Player } from './Player'
import * as crypto from 'crypto'
import { IIndex, Indexes } from '../repository'

const ErrPlayerAlreadyExists = 'Player already exists'
const ErrPlayerNotFound = 'Player not found'

export class Repository {
	private readonly players: Map<string, Player>
	private readonly indexes: Indexes<Player>

	constructor() {
		this.players = new Map()
		this.indexes = new Indexes()
	}

	addIndex(index: IIndex<Player>): this {
		this.indexes.add(index)
		return this
	}

	insert(player: Player) {
		const id = crypto.randomUUID()
		player.setID(id)

		if (this.players.has(id)) {
			throw new Error(ErrPlayerAlreadyExists)
		}
		this.indexes.onInsert(player)
		this.players.set(id, player)
	}

	delete(id: string) {
		const p = this.players.get(id)
		if (p === undefined) {
			throw new Error(ErrPlayerNotFound)
		}
		this.indexes.onDelete(p)
		this.players.delete(id)
	}

	update(id: string, newPlayer: Player) {
		const p = this.players.get(id)
		if (p === undefined) {
			throw new Error(ErrPlayerNotFound)
		}
		this.indexes.onUpdate(p, newPlayer)
		this.players.set(id, newPlayer)
	}
}
