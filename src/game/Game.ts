import { Map } from "../map";
import { Player } from "../player";

export class Game {
  private readonly id: string;
  private readonly players: Set<Player>;
  private readonly map: Map;

  constructor(id: string, map: Map) {
    this.id = id;
    this.players = new Set();
    this.map = map;
  }

  getID(): string {
    return this.id;
  }

  addPlayer(player: Player) {
    this.players.add(player);
  }

  getPlayers(): Set<Player> {
    return this.players;
  }

  deletePlayer(player: Player) {
    this.players.delete(player);
  }

  getMap(): Map {
    return this.map;
  }
}
