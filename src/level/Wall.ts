import { Trap } from "./bridge/Trap";

export class BlackWall implements Trap {
  public getColor(): string {
    return "#000000";
  }
}

export class BrownWall implements Trap {
  public getColor(): string {
    return "#8b4513";
  }
}

export class BlueWall implements Trap {
  public getColor(): string {
    return "#191970";
  }
}
