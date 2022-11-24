import { Map } from "../Map";
import { Map1Builder } from "./Map1Builder";
import { Map2Builder } from "./Map2Builder";
import { Map3Builder } from './Map3Builder'

export class Director {
  public static CreateMap1(map: Map): Map {
    return new Map1Builder(map).addWalls().addLava().addWater().build();
  }

  public static CreateMap2(map: Map): Map {
    return new Map2Builder(map).addWalls().addLava().addWater().build();
  }

  public static CreateMap3(map: Map): Map {
    return new Map3Builder(map).addWalls().addLava().addWater().build();
  }
}
