import { Player, Publisher as PlayerPublisher, Event as PlayerEv } from '../../player'
import { Game } from '../../game'
import { Coordinates, Event as MapEvent, Publisher as MapPublisher } from '../../map'
import { IObject, NullObject, Type } from '../index'
import { Flyweight } from './Flyweight'
import { FlyweightFactory } from './FlyweightFactory'

export abstract class Item implements IObject {
	protected fw: Flyweight
	protected coords: Coordinates
	// protected game: Game
	// protected level: number
	// protected mapPub: MapPublisher
	// protected playerPub: PlayerPublisher

	protected constructor(game: Game, level: number, coords: Coordinates, mapPub: MapPublisher, playerPub: PlayerPublisher) {
		this.fw = FlyweightFactory.getFlyweight(game, level, mapPub, playerPub)
		this.coords = coords
		// this.game = game
		// this.level = level
		// this.mapPub = mapPub
		// this.playerPub = playerPub
	}

	public getCords(): Coordinates {
		return this.coords
	}

	public readonly isSolid = () => false

	public abstract getType(): Type

	public readonly collect = (player: Player): boolean => {
		const sufficient = this.changeScore(player)
		if (!sufficient) {
			return false
		}
		this.onScoreChange(player)

		const deleted = this.deleteCurrentItem()
		const spawned = this.spawnNewItem()
		const teleported = this.teleportPlayer(player)
		if (deleted || spawned) {
			this.onMapChange()
		}
		return !teleported
	}

	public abstract changeScore(player: Player): boolean

	public onScoreChange(player: Player) {
		this.fw.getPlayerPub().publish(PlayerEv.PLAYER_SCORE_CHANGE, player)
	}

	public deleteCurrentItem(): boolean {
		this.fw.getGame()
			.getMap(this.fw.getLevel())
			.setObjectAt(this.coords, new NullObject())
		return true
	}

	public abstract spawnNewItem(): boolean

	public teleportPlayer(player: Player): boolean {
		return false
	}

	public onMapChange() {
		this.fw.getMapPub().publish(MapEvent.MAP_CHANGE, {
			map: this.fw.getGame().getMap(this.fw.getLevel()),
			level: this.fw.getLevel(),
			game: this.fw.getGame()
		})
	}
}
