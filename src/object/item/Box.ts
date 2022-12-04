import { Game } from "../../game/Game";
import { Coordinates } from "../../map/Map";
import { Player, Publisher as PlayerPublisher } from '../../player'
import { Type } from "../IObject";
import { Item } from "./Item";
import { Publisher as MapPublisher } from '../../map'
import { Apple } from "./Apple";
import { Pear } from "./Pear";

export class Box extends Item {
    private children: Item[]
	constructor(game: Game, level: number, coords: Coordinates, mapPub: MapPublisher, playerPub: PlayerPublisher) {
		super(game, level, coords, mapPub, playerPub)
        this.children = []

        this.addChild(new Apple(game, level, coords, mapPub, playerPub));
        if (Math.random() < 0.2) {
            this.addChild(new Pear(game, level, coords, mapPub, playerPub))
        }

        if (Math.random() < 0.6) {
            this.addChild(new Box(game, level, coords, mapPub, playerPub));
        }
	}

    public getType(): Type {
        return Type.BOX;
    }

    public changeScore(player: Player): boolean {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].changeScore(player);
        }
        return true;
    }

    public addChild(item : Item) {
        this.children.push(item);
    }

    public spawnNewItem(): boolean {
        const map = this.fw.getGame().getMap(this.fw.getLevel())
        const coords = map.getRandomEmptyCoords()
        map.setObjectAt(coords, new Box(this.fw.getGame(), this.fw.getLevel(), coords, this.fw.getMapPub(), this.fw.getPlayerPub()))
        return true;
    }

}