import { Flyweight } from './Flyweight'
import { Publisher as MapPublisher } from '../../map'
import { Publisher as PlayerPublisher } from '../../player'
import { Game } from '../../game'

export class FlyweightFactory {
	private static cache: Flyweight[] = []

	public static getFlyweight(game: Game, level: number, mapPub: MapPublisher, playerPub: PlayerPublisher): Flyweight {
		const flyweight = this.cache.find(flyweight =>
			flyweight.getGame() === game &&
			flyweight.getLevel() === level &&
			flyweight.getMapPub() === mapPub &&
			flyweight.getPlayerPub() === playerPub
		)
		if (flyweight) {
			return flyweight
		}
		const newFlyweight = new Flyweight(game, level, mapPub, playerPub)
		this.cache.push(newFlyweight)
		return newFlyweight
	}

	public static cacheSize(): number {
		return this.cache.length
	}
}
