export interface Player {
  getColor(): string;
}

export class RedPlayer implements Player {
  public getColor(): string {
    return "red";
  }
}

export class YellowPlayer implements Player {
  public getColor(): string {
    return "yellow";
  }
}

export class PurplePlayer implements Player {
  public getColor(): string {
    return "purple";
  }
}
