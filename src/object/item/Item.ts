import { Player, Publisher as PlayerPublisher, Event as PlayerEv } from '../../player'
import { Game } from '../../game'
import { Coordinates, Event as MapEvent, Publisher as MapPublisher } from '../../map'
import { IObject, NullObject, Type } from '../index'

export abstract class Item implements IObject {
	protected game: Game
	protected level: number
	protected coords: Coordinates
	protected mapPub: MapPublisher
	protected playerPub: PlayerPublisher

	protected constructor(game: Game, level: number, coords: Coordinates, mapPub: MapPublisher, playerPub: PlayerPublisher) {
		this.game = game
		this.level = level
		this.coords = coords
		this.mapPub = mapPub
		this.playerPub = playerPub
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
		this.playerPub.publish(PlayerEv.PLAYER_SCORE_CHANGE, player)
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
		this.mapPub.publish(MapEvent.MAP_CHANGE, {
			map: this.game.getMap(this.level),
			game: this.game
		})
	}
}
