import { Trap } from "./bridge/Trap";

export class ColarLava implements Trap {
  public getColor(): string {
    return "#ff7f50";
  }
}

export class LightCoralLava implements Trap {
  public getColor(): string {
    return "#f08080";
  }
}

export class RedLava implements Trap {
  public getColor(): string {
    return "#ff0000";
  }
}
