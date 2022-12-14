import { Lava } from "../../object/Lava";
import { Wall } from "../../object/wall/Wall";
import { Water } from "../../object/Water";
import { Map } from "../Map";
import { IBuilder } from "./IBuilder";
import { Game } from '../../game'
import { Publisher as MapPublisher } from '../Publisher'
import { Apple } from '../../object/item/Apple'
import { Pear } from '../../object/item/Pear'
import { Portal } from '../../object/item/Portal'
import { Publisher as PlayerPublisher } from '../../player'
import { Box } from "../../object/item/Box";
import { GiftBox } from '../../object/item/GiftBox'
import { BadApple } from '../../object/item/BadApple'

export class Map2Builder implements IBuilder {
    private map : Map;
    constructor (map : Map) {
        this.map = map.clone();
    }

    addWalls(): IBuilder {
        let wall = new Wall();
        for (let i = 8; i < 13; i++)
            this.map.setObjectAt( { x: 2, y: i }, wall);

        this.map.setObjectAt( { x: 3, y: 12 }, wall);
        
        for (let i = 1; i < 5; i++)
            this.map.setObjectAt( { x: i, y: 6 }, wall);
        for (let i = 11; i < 14; i++)
            this.map.setObjectAt( { x: 5, y: i }, wall);
        for (let i = 8; i < 11; i++)
            this.map.setObjectAt( { x: 4, y: i }, wall);
        for (let i = 8; i < 11; i++)
            this.map.setObjectAt( { x: 4, y: i }, wall);
        
        this.map.setObjectAt( {x: 5, y: 8}, wall);

        for (let i = 4; i < 9; i++)
            this.map.setObjectAt( {x: 6, y: i}, wall);
        for (let i = 2; i < 7; i++)
            this.map.setObjectAt( {x: i, y: 4}, wall);
        for (let i = 1; i < 3; i++)
            this.map.setObjectAt( {x: 1, y: i}, wall);
        
        this.map.setObjectAt( {x: 3, y: 2}, wall);
        this.map.setObjectAt( {x: 3, y: 3}, wall);

        for (let i = 5; i < 10; i++)
            this.map.setObjectAt( {x: i, y: 1}, wall);

        for (let i = 1; i < 13; i++)
            this.map.setObjectAt( {x: 9, y: i}, wall);

        this.map.setObjectAt( {x: 11, y: 12}, wall);
        this.map.setObjectAt( {x: 11, y: 13}, wall);

        for (let i = 2; i < 14; i++)
            this.map.setObjectAt( {x: 12, y: i}, wall);

        for (let i = 17; i < 19; i++)
            for (let j = 1; j < 5; j++)
                this.map.setObjectAt( {x: i, y: j}, wall);

        for (let i = 17; i < 19; i++)
            for (let j = 9; j < 12; j++)
                this.map.setObjectAt( {x: i, y: j}, wall);

        for (let i = 14; i < 17; i++)
            this.map.setObjectAt( {x: i, y: 11}, wall);

        return this;
    }
    addLava(): IBuilder {
        let lava = new Lava();

        if (Math.random() < 0.5)
            this.map.setObjectAt( { x: 2, y: 7 }, lava);

        if (Math.random() < 0.5)
            this.map.setObjectAt( {x: 5, y: 2}, lava);

        this.map.setObjectAt( {x: 8, y: 7}, lava);
        this.map.setObjectAt( {x: 8, y: 8}, lava);
        this.map.setObjectAt( {x: 8, y: 9}, lava);

        this.map.setObjectAt( {x: 10, y: 8}, lava);
        this.map.setObjectAt( {x: 10, y: 4}, lava);

        for (let i = 1; i < 5; i++)
            this.map.setObjectAt( {x: 16, y: i}, lava);

        this.map.setObjectAt( {x: 15, y: 5}, lava);
        this.map.setObjectAt( {x: 14, y: 6}, lava);

        this.map.setObjectAt( {x: 13, y: 13}, lava);
        this.map.setObjectAt( {x: 14, y: 13}, lava);

        return this;
    }
    addWater(): IBuilder {
        let water = new Water();
        if (this.map.getObjectAt({x: 5, y: 2}) === null || this.map.getObjectAt({x: 5, y: 2})?.getType() === "NULL")
            this.map.setObjectAt( {x: 5, y: 2}, water);

        this.map.setObjectAt( {x: 7, y: 4}, water);
        this.map.setObjectAt( {x: 7, y: 5}, water);
        this.map.setObjectAt( {x: 7, y: 10}, water);

        this.map.setObjectAt( {x: 11, y: 2}, water);
        this.map.setObjectAt( {x: 11, y: 6}, water);

        this.map.setObjectAt( {x: 13, y: 2}, water);
        this.map.setObjectAt( {x: 14, y: 3}, water);

        this.map.setObjectAt( {x: 13, y: 8}, water);
        this.map.setObjectAt( {x: 14, y: 9}, water);
        this.map.setObjectAt( {x: 15, y: 9}, water);
        this.map.setObjectAt( {x: 15, y: 8}, water);
        this.map.setObjectAt( {x: 16, y: 7}, water);
        this.map.setObjectAt( {x: 17, y: 7}, water);

        this.map.setObjectAt( {x: 16, y: 12}, water);
        this.map.setObjectAt( {x: 17, y: 12}, water);

        return this;
    }

	addItems(game: Game, level: number, mapPub: MapPublisher, playerPub: PlayerPublisher): IBuilder {
		const portalCoords = { x: 6, y: 12 }
		this.map.setObjectAt(
			portalCoords,
			new Portal(game, level, portalCoords, mapPub, playerPub, { x: 16, y: 8 }),
		)

		for (let i = 0; i < 5; i++) {
			const coords = this.map.getRandomEmptyCoords()
			this.map.setObjectAt(coords, new Apple(game, level, coords, mapPub, playerPub))
		}
		for (let i = 0; i < 3; i++) {
			const coords = this.map.getRandomEmptyCoords()
			this.map.setObjectAt(coords, new Pear(game, level, coords, mapPub, playerPub))
		}

        for (let i = 0; i < 2; i++) {
			const coords = this.map.getRandomEmptyCoords()
			this.map.setObjectAt(coords, new Box(game, level, coords, mapPub, playerPub))
		}

        for (let i = 0; i < 3; i++) {
			const coords = this.map.getRandomEmptyCoords()
			this.map.setObjectAt(coords, new GiftBox(game, level, coords, mapPub, playerPub))
		}

		for (let i = 0; i < 3; i++) {
			const coords = this.map.getRandomEmptyCoords()
			this.map.setObjectAt(coords, new BadApple(game, level, coords, mapPub, playerPub))
		}

		return this
	}

    build(): Map {
        return this.map;
    }
}
