// Start
import { Type } from "../object";
import { Coordinates, SpawnPoint } from "../map";
import { LevelResponse } from "../level/Level";

export type Map = {
  height: number;
  width: number;
  spawnPoint: SpawnPoint;
  objects: Type[][];
};

export type StartRes = {
  map: Map;
  colors?: LevelResponse;
};

// GetPlayers
export type GetPlayersRes = {
  users: {
    id: string;
    username: string;
    level: number;
    coords: Coordinates;
	image: string | null;
  }[];
};
