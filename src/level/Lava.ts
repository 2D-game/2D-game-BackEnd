export interface Lava {
  getColor(): string;
}

export class ColarLava implements Lava {
  public getColor(): string {
    return "#ff7f50";
  }
}

export class LightCoralLava implements Lava {
  public getColor(): string {
    return "#f08080";
  }
}

export class RedLava implements Lava {
  public getColor(): string {
    return "#ff0000";
  }
}
