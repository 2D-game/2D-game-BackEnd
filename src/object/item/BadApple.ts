import { Item } from './Item'
import { Player, Publisher as PlayerPublisher } from '../../player'
import { Game } from '../../game'
import { Coordinates } from '../../map'
import { Type } from '../IObject'
import { Publisher as MapPublisher } from '../../map'

export class BadApple extends Item
{
    constructor(game: Game, level: number, coords: Coordinates, mapPub: MapPublisher, playerPub: PlayerPublisher) {
		super(game, level, coords, mapPub, playerPub)
	}

    public getType(): Type {
        return Type.BAD_APPLE;
    }
    public changeScore(player: Player): boolean {
        player.deductScore(5);
        return true;
    }
    public spawnNewItem(): boolean {
		const map = this.fw.getGame().getMap(this.fw.getLevel())
		const coords = map.getRandomEmptyCoords()
		map.setObjectAt(coords, new BadApple(this.fw.getGame(), this.fw.getLevel(), coords, this.fw.getMapPub(), this.fw.getPlayerPub()))
		return true
    }
    
}