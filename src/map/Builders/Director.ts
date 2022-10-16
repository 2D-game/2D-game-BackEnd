import { Map } from "../Map";
import { Map1Builder } from "./Map1Builder";

export class Director {
    public static CreateMap1(map : Map) : Map {
        return new Map1Builder(map).addWalls().addLava().addWater().build();
    }
}