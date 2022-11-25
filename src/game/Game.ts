import { Map } from '../map'
import { Player } from '../player'
import { Director } from '../map/Builders/Director'
import { Levels } from '../level/Level'
import { Publisher as MapPublisher } from '../map'
import { Publisher as PlayerPublisher } from '../player'

export class Game {
	private readonly id: string
	private readonly players: Set<Player>
	private readonly maps: Map[]

	constructor(id: string, mapPub: MapPublisher, playerPub: PlayerPublisher) {
		this.id = id
		this.players = new Set()

		const firstMap = Director.CreateMap1(Levels[0].createMap().getInitialData(), this, 0, mapPub, playerPub)
		const secondMap = Director.CreateMap2(Levels[1].createMap().getInitialData(), this, 1, mapPub, playerPub)
		const thirdMap = Director.CreateMap3(Levels[2].createMap().getInitialData(), this, 2, mapPub, playerPub)
		this.maps = [firstMap, secondMap, thirdMap]
	}

	getID(): string {
		return this.id
	}

	addPlayer(player: Player) {
		this.players.add(player)
	}

	getPlayers(): Set<Player> {
		return this.players
	}

	deletePlayer(player: Player) {
		this.players.delete(player)
	}

	getMap(level: number): Map {
		return this.maps[level]
	}
}
