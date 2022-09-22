import { Game } from './Game'
import { Player } from '../player'
import { IIndex } from '../repository'

const ErrGameNotFound = 'Game not found'
const ErrGameNotEmpty = 'Game not empty'
const ErrGameAlreadyExists = 'Game already exists'
const ErrGamePlayerNotFound = 'Game player not found'
const ErrGamePlayerAlreadyExists = 'Game player already exists'
const ErrPlayerIsNotInGame = 'Player is not in game'

class PlayerIndexAdapter implements IIndex<Player>{
	private readonly index: Index

	constructor(index: Index) {
		this.index = index
	}

	insert(player: Player) {
		if (player.getGame() === null) {
			return
		}
		this.index.insertGamePlayer(player)
	}

	delete(player: Player) {
		if (player.getGame() === null) {
			return
		}
		this.index.deleteGamePlayer(player)
	}

	update(oldPlayer: Player, newPlayer: Player) {
		if (oldPlayer.getGame() !== newPlayer.getGame()) {
			this.delete(oldPlayer)
			this.insert(newPlayer)
		}
	}
}

class Index {
	private readonly gamePlayers: Map<Game, Set<Player>>

	constructor() {
		this.gamePlayers = new Map()
	}

	playersCount(game: Game): number {
		const p = this.gamePlayers.get(game)
		if (p === undefined) {
			throw new Error(ErrGameNotFound)
		}
		return p.size
	}

	getPlayers(game: Game): Set<Player> {
		const p = this.gamePlayers.get(game)
		if (p === undefined) {
			throw new Error(ErrGameNotFound)
		}
		return p
	}

	insertGame(game: Game) {
		if (this.gamePlayers.has(game)) {
			throw new Error(ErrGameAlreadyExists)
		}
		this.gamePlayers.set(game, new Set())
	}

	deleteGame(game: Game) {
		const p = this.gamePlayers.get(game)
		if (p === undefined) {
			throw new Error(ErrGameNotFound)
		}
		if (p.size > 0) {
			throw new Error(ErrGameNotEmpty)
		}
		this.gamePlayers.delete(game)
	}

	insertGamePlayer(player: Player) {
		const game = player.getGame()
		if (game === null) {
			throw new Error(ErrPlayerIsNotInGame)
		}

		const p = this.gamePlayers.get(game)
		if (p === undefined) {
			throw new Error(ErrGameNotFound)
		}
		if (p.has(player)) {
			throw new Error(ErrGamePlayerAlreadyExists)
		}
		p.add(player)
	}

	deleteGamePlayer(player: Player) {
		const game = player.getGame()
		if (game === null) {
			throw new Error(ErrPlayerIsNotInGame)
		}

		const p = this.gamePlayers.get(game)
		if (p === undefined) {
			throw new Error(ErrGameNotFound)
		}
		if (!p.delete(player)) {
			throw new Error(ErrGamePlayerNotFound)
		}
	}
}

export class Repository {
	private readonly index: Index

	constructor() {
		this.index = new Index()
	}

	getPlayerIndex(): PlayerIndexAdapter {
		return new PlayerIndexAdapter(this.index)
	}

	insert(game: Game) {
		this.index.insertGame(game)
	}

	delete(game: Game) {
		this.index.deleteGame(game)
	}

	playersCount(game: Game): number {
		return this.index.playersCount(game)
	}

	getPlayers(game: Game): Set<Player> {
		return this.index.getPlayers(game)
	}
}
