// Start
import { Type } from "../object";
import { Coordinates, SpawnPoint } from "../map";

export type Map = {
  height: number;
  width: number;
  spawnPoint: SpawnPoint;
  objects: Type[][];
};

export type StartRes = {
  map: Map;
};

// GetPlayers
export type GetPlayersRes = {
  users: {
    id: string;
    username: string;
    level: number;
    coords: Coordinates;
  }[];
};
