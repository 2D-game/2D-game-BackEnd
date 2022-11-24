import { Player } from '../../player'
import { Game } from '../../game'
import { Coordinates } from '../../map'
import { IObject, NullObject, Type } from '../index'
import { Event, Publisher } from '../../map'

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

	public readonly collect = (player: Player) => {
		this.changeScore(player)
		const deleted = this.deleteCurrentItem()
		const spawned = this.spawnNewItem()
		this.teleportPlayer(player)
		if (deleted || spawned) {
			this.onMapChange()
		}
	}

	public abstract changeScore(player: Player): void

	public deleteCurrentItem(): boolean {
		this.game
			.getMap(this.level)
			.setObjectAt(this.coords, new NullObject())
		return true
	}

	public abstract spawnNewItem(): boolean

	public teleportPlayer(player: Player) { }

	public onMapChange() {
		this.pub.publish(Event.MAP_CHANGE, {
			map: this.game.getMap(this.level),
			game: this.game,
		})
	}
}
