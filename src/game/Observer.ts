import { Publisher as LobbyPub, Event as LobbyEv, Lobby } from "../lobby";
import { IObserver } from "../util/Observer";
import { Usecase, Publisher as GamePub, Event as GameEv, Game } from "./";
import { Publisher as PlayerPub, Event as PlayerEv, Player } from "../player";
import { Server as IOServer } from "socket.io";
import { ExtendedSocket } from "../util/Socket";

export class LobbyObserver implements IObserver {
  private readonly lobbyPub: LobbyPub;
  private readonly io: IOServer;
  private readonly ucase: Usecase;

  constructor(lobbyPub: LobbyPub, io: IOServer, ucase: Usecase) {
    this.lobbyPub = lobbyPub;
    this.io = io;
    this.ucase = ucase;
  }

  start() {
    this.lobbyPub.subscribe(
      LobbyEv.PLAYER_READINESS_CHANGE,
      this.onPlayerReadinessChange.bind(this)
    );
  }

  stop() {
    this.lobbyPub.unsubscribe(
      LobbyEv.PLAYER_READINESS_CHANGE,
      this.onPlayerReadinessChange.bind(this)
    );
  }

  private onPlayerReadinessChange(lobby: Lobby) {
    const [started, res] = this.ucase.start(lobby);
    if (!started || res === null) {
      return;
    }

    this.io.to(lobby.getID()).emit("start_game", ExtendedSocket.response(res));
  }
}

export class PlayerObserver implements IObserver {
  private readonly playerPub: PlayerPub;
  private readonly ucase: Usecase;

  constructor(playerPub: PlayerPub, ucase: Usecase) {
    this.playerPub = playerPub;
    this.ucase = ucase;
  }

  start() {
    this.playerPub.subscribe(
      PlayerEv.PLAYER_DISCONNECTED,
      this.onPlayerDisconnect.bind(this)
    );
  }

  stop() {
    this.playerPub.unsubscribe(
      PlayerEv.PLAYER_DISCONNECTED,
      this.onPlayerDisconnect.bind(this)
    );
  }

  private onPlayerDisconnect(player: Player) {
    this.ucase.deletePlayer(player);
  }
}

export class Observer implements IObserver {
  private readonly gamePub: GamePub;
  private readonly io: IOServer;
  private readonly ucase: Usecase;

  constructor(gamePub: GamePub, io: IOServer, ucase: Usecase) {
    this.gamePub = gamePub;
    this.io = io;
    this.ucase = ucase;
  }

  start() {
    this.gamePub.subscribe(
      GameEv.PLAYER_LIST_CHANGE,
      this.onPlayerListChange.bind(this)
    );
  }

  stop() {
    this.gamePub.unsubscribe(
      GameEv.PLAYER_LIST_CHANGE,
      this.onPlayerListChange.bind(this)
    );
  }

  private onPlayerListChange(game: Game) {
    const res = ExtendedSocket.response(this.ucase.getPlayers(game));
    this.io.to(game.getID()).emit("game_player_list", res);
  }
}
