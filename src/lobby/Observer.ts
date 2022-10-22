import { Usecase, Publisher as LobbyPub, Event as LobbyEv, Lobby } from "./";
import { IObserver } from "../util/Observer";
import { Player, Publisher as PlayerPub, Event as PlayerEv } from "../player";
import { Server as IOServer } from "socket.io";
import { ExtendedSocket } from "../util/Socket";

export class Observer implements IObserver {
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
      LobbyEv.PLAYER_LIST_CHANGE,
      this.onPlayerListChange.bind(this)
    );
  }

  stop() {
    this.lobbyPub.unsubscribe(
      LobbyEv.PLAYER_LIST_CHANGE,
      this.onPlayerListChange.bind(this)
    );
  }

  private onPlayerListChange(lobby: Lobby) {
    const res = ExtendedSocket.response(this.ucase.getPlayers(lobby));
    this.io.to(lobby.getID()).emit("lobby_player_list", res);
  }
}

export class PlayerObserver implements IObserver {
  private readonly playerPub: PlayerPub;
  private readonly io: IOServer;
  private readonly ucase: Usecase;

  constructor(playerPub: PlayerPub, io: IOServer, ucase: Usecase) {
    this.playerPub = playerPub;
    this.io = io;
    this.ucase = ucase;
  }

  start() {
    this.playerPub.subscribe(
      PlayerEv.PLAYER_CREATED,
      this.onPlayerConnect.bind(this)
    );
    this.playerPub.subscribe(
      PlayerEv.PLAYER_READY,
      this.onPlayerReady.bind(this)
    );
    this.playerPub.subscribe(
      PlayerEv.PLAYER_DISCONNECTED,
      this.onPlayerDisconnect.bind(this)
    );
  }

  stop() {
    this.playerPub.unsubscribe(
      PlayerEv.PLAYER_CREATED,
      this.onPlayerConnect.bind(this)
    );
    this.playerPub.unsubscribe(
      PlayerEv.PLAYER_READY,
      this.onPlayerReady.bind(this)
    );
    this.playerPub.unsubscribe(
      PlayerEv.PLAYER_DISCONNECTED,
      this.onPlayerDisconnect.bind(this)
    );
  }

  private onPlayerConnect(player: Player) {
    this.ucase.addPlayer(player);
  }

  private onPlayerReady(player: Player) {
    this.ucase.playerIsReady(player);
  }

  private onPlayerDisconnect(player: Player) {
    this.ucase.deletePlayer(player);
  }
}
