import { Player } from './Player'
import * as crypto from 'crypto'
import { Indexes } from '../repository'

const ErrPlayerAlreadyExists = 'Player already exists'
const ErrPlayerNotFound = 'Player not found'

class Index {
	private readonly players: Map<string, Player>
	private readonly childIndexes: Indexes<Player>

	constructor(childIndexes: Indexes<Player>) {
		this.players = new Map()
		this.childIndexes = childIndexes
	}

	insertPlayer(player: Player) {
		const id = player.getID()
		if (this.players.has(id)) {
			throw new Error(ErrPlayerAlreadyExists)
		}
		this.childIndexes.onInsert(player)
		this.players.set(id, player)
	}

	deletePlayer(id: string) {
		const p = this.players.get(id)
		if (p === undefined) {
			throw new Error(ErrPlayerNotFound)
		}
		this.childIndexes.onDelete(p)
		this.players.delete(id)
	}

	updatePlayer(id: string, newPlayer: Player) {
		const p = this.players.get(id)
		if (p === undefined) {
			throw new Error(ErrPlayerNotFound)
		}
		this.childIndexes.onUpdate(p, newPlayer)
		this.players.set(id, newPlayer)
	}
}

export class Repository {
	private readonly index: Index

	constructor(childIndexes: Indexes<Player>) {
		this.index = new Index(childIndexes)
	}

	insert(player: Player) {
		const id = crypto.randomUUID()
		player.setID(id)
		this.index.insertPlayer(player)
	}

	delete(id: string) {
		return this.index.deletePlayer(id)
	}

	update(id: string, newPlayer: Player) {
		return this.index.updatePlayer(id, newPlayer)
	}
}
