import { Trap } from "./bridge/Trap";

export class BlueWater implements Trap {
  public getColor(): string {
    return "#0000ff";
  }
}

export class DodgerBlueWater implements Trap {
  public getColor(): string {
    return "#1e90ff";
  }
}

export class DarkBlueWater implements Trap {
  public getColor(): string {
    return "#00008b";
  }
}
