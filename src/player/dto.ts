import { z } from "zod";
import { Coordinates } from "../map";
import * as dto from "../game";

// Move
export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

export const MoveReq = z.object({
  direction: z.nativeEnum(Direction),
});
export type MoveReq = z.infer<typeof MoveReq>;

export type MoveRes = {
  id: string;
  level: number;
  coords: Coordinates;
  map?: dto.Map;
  userName?: string;
};

// SetReady
export type SetReadyRes = {
  id: string;
};
