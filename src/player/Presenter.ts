import * as dto from "./dto";
import { Player } from "./Player";

export class Presenter {
  static getMoveRes(player: Player): dto.MoveRes {
    return {
      id: player.getID(),
      level: player.getLevel(),
      coords: player.getCoords(),
    };
  }
}
