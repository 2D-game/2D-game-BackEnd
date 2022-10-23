import { LightCoralLava, RedLava, Lava, ColarLava } from "./Lava";
import { Water, DarkBlueWater, BlueWater, DodgerBlueWater } from "./Water";
import { BlackWall, BlueWall, BrownWall, Wall } from "./Wall";
import { FirstMap, MapDimensions, SecondMap, ThirdMap } from "./Map";
import { Map } from "../map";

export interface Level {
  createMap(): MapDimensions;
  createLava(): Lava;
  createWall(): Wall;
  createWater(): Water;
}

export class FirstLevel implements Level {
  public createMap(): MapDimensions {
    return new FirstMap();
  }

  public createLava(): Lava {
    return new ColarLava();
  }

  public createWall(): Wall {
    return new BlackWall();
  }

  public createWater(): Water {
    return new BlueWater();
  }
}

export class SecondLevel implements Level {
  public createMap(): MapDimensions {
    return new SecondMap();
  }

  public createLava(): Lava {
    return new LightCoralLava();
  }

  public createWall(): Wall {
    return new BrownWall();
  }

  public createWater(): Water {
    return new DodgerBlueWater();
  }
}

export class ThirdLevel implements Level {
  public createMap(): MapDimensions {
    return new ThirdMap();
  }

  public createLava(): Lava {
    return new RedLava();
  }

  public createWall(): Wall {
    return new BlueWall();
  }

  public createWater(): Water {
    return new DarkBlueWater();
  }
}

export interface LevelResponse {
  map: Map;
  lava: string;
  wall: string;
  water: string;
}

export const createLevel = (factory: Level): LevelResponse => {
  const response: LevelResponse = {
    map: factory.createMap().getInitialData(),
    lava: factory.createLava().getColor(),
    wall: factory.createWall().getColor(),
    water: factory.createWater().getColor(),
  };

  return response;
};

export const Levels: Level[] = [
  new FirstLevel(),
  new SecondLevel(),
  new ThirdLevel(),
];
