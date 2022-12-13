import { Game } from "../../game/Game";
import { Coordinates } from "../../map/Map";
import { Player, Publisher as PlayerPublisher } from '../../player'
import { Type } from "../IObject";
import { Item } from "./Item";
import { Publisher as MapPublisher } from '../../map'
import { IterableBox } from "./IterableBox";
import { Iterator } from "../../util/Iterator";
import { BadApple } from "./BadApple";
import { GiftBoxIterator } from "./GiftBoxIterator";

export class GiftBox extends IterableBox
{
    private items: Item[]
    public length: number
    constructor(game: Game, level: number, coords: Coordinates, mapPub: MapPublisher, playerPub: PlayerPublisher) {
		super(game, level, coords, mapPub, playerPub)
        this.items = [];
        this.length = 0;
        this.addItem(new BadApple(game, level, coords, mapPub, playerPub))

        if (Math.random() < 0.3) {
            this.addItem(new BadApple(game, level, coords, mapPub, playerPub))
        }

        if (Math.random() < 0.3) {
            this.addItem(new BadApple(game, level, coords, mapPub, playerPub))
        }

        if (Math.random() < 0.3) {
            this.addItem(new BadApple(game, level, coords, mapPub, playerPub))
        }

        if (Math.random() < 0.6) {
            this.addItem(new BadApple(game, level, coords, mapPub, playerPub));
        }
	}

    public getType(): Type {
        return Type.GIFT_BOX;
    }

    public changeScore(player: Player): boolean {
        let iterator = this.createIterator();
        while (iterator.hasNext())
        {
            let item = iterator.getNext()
            if (item) {
                item.changeScore(player)
            }
        }

        return true;
    }

    public spawnNewItem(): boolean {
        const map = this.fw.getGame().getMap(this.fw.getLevel())
        const coords = map.getRandomEmptyCoords()
        map.setObjectAt(coords, new GiftBox(this.fw.getGame(), this.fw.getLevel(), coords, this.fw.getMapPub(), this.fw.getPlayerPub()))
        return true;
    }

    public addItem(item : Item) {
        this.items.push(item);
        this.length++;
    }

    public getItem(index : number) {
        return this.items[index];
    }
    
    public collect = (player: Player): boolean => {
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

    public createIterator(): GiftBoxIterator {
        return new GiftBoxIterator(this);
    }
}