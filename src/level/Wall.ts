export interface Wall {
  getColor(): string;
}

export class BlackWall implements Wall {
  public getColor(): string {
    return "black";
  }
}

export class BrownWall implements Wall {
  public getColor(): string {
    return "brown";
  }
}

export class BlueWall implements Wall {
  public getColor(): string {
    return "blue";
  }
}
