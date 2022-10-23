export interface Ground {
  getColor(): string;
}

export class WhiteGround implements Ground {
  public getColor(): string {
    return "white";
  }
}

export class GrayGround implements Ground {
  public getColor(): string {
    return "gray";
  }
}

export class GreenGround implements Ground {
  public getColor(): string {
    return "green";
  }
}
