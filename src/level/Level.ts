import { LightCoralLava, RedLava, ColarLava } from "./Lava";
import { DarkBlueWater, BlueWater, DodgerBlueWater } from "./Water";
import { BlackWall, BlueWall, BrownWall } from "./Wall";
import { FirstMap, MapDimensions, SecondMap, ThirdMap } from "./Map";
import { Map } from "../map";
import { Trap } from "./bridge/Trap";

export interface Level {
  createMap(): MapDimensions;
  createLava(): Trap;
  createWall(): Trap;
  createWater(): Trap;
}

export class FirstLevel implements Level {
  public createMap(): MapDimensions {
    return new FirstMap();
  }

  public createLava(): Trap {
    return new ColarLava();
  }

  public createWall(): Trap {
    return new BlackWall();
  }

  public createWater(): Trap {
    return new BlueWater();
  }
}

export class SecondLevel implements Level {
  public createMap(): MapDimensions {
    return new SecondMap();
  }

  public createLava(): Trap {
    return new LightCoralLava();
  }

  public createWall(): Trap {
    return new BrownWall();
  }

  public createWater(): Trap {
    return new DodgerBlueWater();
  }
}

export class ThirdLevel implements Level {
  public createMap(): MapDimensions {
    return new ThirdMap();
  }

  public createLava(): Trap {
    return new RedLava();
  }

  public createWall(): Trap {
    return new BlueWall();
  }

  public createWater(): Trap {
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
