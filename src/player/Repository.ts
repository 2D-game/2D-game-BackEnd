import { Player } from './Player'
import * as crypto from 'crypto'
import { IIndex } from '../repository'

const ErrPlayerAlreadyExists = 'Player already exists'
const ErrPlayerNotFound = 'Player not found'

export class Repository {
	private readonly players: Map<string, Player>
	private readonly indexes: IIndex<Player>[]

	constructor() {
		this.players = new Map()
		this.indexes = []
	}

	addIndex(index: IIndex<Player>): this {
		this.indexes.push(index)
		return this
	}

	insert(player: Player) {
		const id = crypto.randomUUID()
		player.setID(id)

		if (this.players.has(id)) {
			throw new Error(ErrPlayerAlreadyExists)
		}
		this.indexes.forEach((index) => index.insert(player))
		this.players.set(id, player)
	}

	delete(id: string) {
		const p = this.players.get(id)
		if (p === undefined) {
			throw new Error(ErrPlayerNotFound)
		}
		this.indexes.forEach((index) => index.delete(p))
		this.players.delete(id)
	}
}
