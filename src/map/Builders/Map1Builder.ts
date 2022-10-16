import { Lava } from "../../object/Lava";
import { Wall } from "../../object/wall/Wall";
import { Water } from "../../object/Water";
import { Map } from "../Map";
import { IBuilder } from "./IBuilder";


export class Map1Builder implements IBuilder {
    private map : Map;
    constructor(map : Map) {
        this.map = map.clone();
    }

    addWalls(): IBuilder {
        let wall = new Wall()
        for (let i = 1; i < this.map.getHeight() - 2; i++)
            this.map.setObjectAt( { x: 2, y: i }, wall);

        for (let i = 2; i < this.map.getHeight() - 1; i++)
            this.map.setObjectAt( { x: 4, y: i }, wall);

        for (let i = 11; i < 17; i++)
            for (let j = 3; j < 7; j++)
                this.map.setObjectAt({x : i, y : j}, wall);

        return this
    }

    addLava(): IBuilder {
        let lava = new Lava()
        this.map.setObjectAt( { x: 5, y: 2 }, lava);
        this.map.setObjectAt( { x: 6, y: 2 }, lava);

        if (Math.random() < 0.5) {
            this.map.setObjectAt( { x: 12, y: 1 }, lava);
        }

        if (Math.random() < 0.5) {
            this.map.setObjectAt( { x: 12, y: 2 }, lava);
        }

        if (Math.random() < 0.5) {
            this.map.setObjectAt( { x: 13, y: 1 }, lava);
        }

        if (Math.random() < 0.5) {
            this.map.setObjectAt( { x: 13, y: 2 }, lava);
        }

        return this
    }

    addWater(): IBuilder {
        let water = new Water()
        for (let i = 1; i < 6; i++)
            this.map.setObjectAt( { x: 8, y: i }, water);

        return this
    }

    build(): Map {
        return this.map;
    }

}