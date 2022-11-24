import { Lava } from "../../object/Lava";
import { Wall } from "../../object/wall/Wall";
import { Water } from "../../object/Water";
import { Map } from "../Map";
import { IBuilder } from "./IBuilder";

export class Map3Builder implements IBuilder {
    private map : Map;
    constructor (map : Map) {
        this.map = map.clone();
    }

    addWalls(): IBuilder {
        let wall = new Wall();
        for (let i = 2; i < 14; i++)
            this.map.setObjectAt( { x: 2, y: i }, wall);

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
    build(): Map {
        return this.map;
    }



}
