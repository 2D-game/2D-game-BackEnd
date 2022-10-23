export interface Water {
  getColor(): string;
}

export class BlueWater implements Water {
  public getColor(): string {
    return "#0000ff";
  }
}

export class DodgerBlueWater implements Water {
  public getColor(): string {
    return "#1e90ff";
  }
}

export class DarkBlueWater implements Water {
  public getColor(): string {
    return "#00008b";
  }
}
