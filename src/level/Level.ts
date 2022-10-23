import { LightCoralLava, RedLava, Lava, ColarLava } from "./Lava";
import { Water, DarkBlueWater, BlueWater, DodgerBlueWater } from "./Water";
import { BlackWall, BlueWall, BrownWall, Wall } from "./Wall";

export interface Level {
  createLava(): Lava;
  createWall(): Wall;
  createWater(): Water;
}

export class FirstLevel implements Level {
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
  lava: string;
  wall: string;
  water: string;
}

export const createLevel = (factory: Level): LevelResponse => {
  const response: LevelResponse = {
    lava: factory.createLava().getColor(),
    wall: factory.createWall().getColor(),
    water: factory.createWater().getColor(),
  };

  return response;
};

export const Levels: Level[] = [
  new ThirdLevel(),
  new SecondLevel(),
  new ThirdLevel(),
];
