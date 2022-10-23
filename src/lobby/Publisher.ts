import { IPublisher } from "../util/Observer";
import { Lobby } from "./Lobby";

export enum Event {
  PLAYER_LIST_CHANGE = "PLAYER_LIST_CHANGE",
  PLAYER_READINESS_CHANGE = "PLAYER_READINESS_CHANGE",
}

export class Publisher extends IPublisher<Event, Lobby> {
  constructor() {
    super();
  }
}
