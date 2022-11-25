import { Player } from '../../player'
import { Game } from '../../game'
import { Coordinates, Event, Publisher } from '../../map'
import { IObject, NullObject, Type } from '../index'

export abstract class Item implements IObject {
	protected game: Game
	protected level: number
	protected coords: Coordinates
	protected pub: Publisher

	protected constructor(game: Game, level: number, coords: Coordinates, pub: Publisher) {
		this.game = game
		this.level = level
		this.coords = coords
		this.pub = pub
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
		this.onScoreChange()

		const deleted = this.deleteCurrentItem()
		const spawned = this.spawnNewItem()
		const teleported = this.teleportPlayer(player)
		if (deleted || spawned) {
			this.onMapChange()
		}
		return !teleported
	}

	public abstract changeScore(player: Player): boolean

	public onScoreChange() {

	}

	public deleteCurrentItem(): boolean {
		this.game
			.getMap(this.level)
			.setObjectAt(this.coords, new NullObject())
		return true
	}

	public abstract spawnNewItem(): boolean

	public teleportPlayer(player: Player): boolean {
		return false
	}

	public onMapChange() {
		this.pub.publish(Event.MAP_CHANGE, {
			map: this.game.getMap(this.level),
			game: this.game
		})
	}
}
