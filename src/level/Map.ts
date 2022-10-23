import { Map } from "../map";

export interface MapDimensions {
  getInitialData(): Map;
}

export class FirstMap implements MapDimensions {
  public getInitialData(): Map {
    return new Map(10, 20, { x: 1, y: 1 }, { x: 1, y: 18 }).addWallOutline();
  }
}

export class SecondMap implements MapDimensions {
  public getInitialData(): Map {
    return new Map(15, 20, { x: 1, y: 13 }, { x: 13, y: 18 }).addWallOutline();
  }
}

export class ThirdMap implements MapDimensions {
  public getInitialData(): Map {
    return new Map(15, 20, { x: 1, y: 13 }, { x: 13, y: 18 }).addWallOutline();
  }
}
