export interface Wall {
  getColor(): string;
}

export class BlackWall implements Wall {
  public getColor(): string {
    return "#000000";
  }
}

export class BrownWall implements Wall {
  public getColor(): string {
    return "#8b4513";
  }
}

export class BlueWall implements Wall {
  public getColor(): string {
    return "#191970";
  }
}
