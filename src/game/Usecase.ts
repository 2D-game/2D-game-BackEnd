import { Levels } from "./../level/Level";
import { Game, Presenter, Event, Publisher } from "./";
import { Player } from "../player";
import * as dto from "./dto";
import { Lobby } from "../lobby";
import { Map } from "../map";
import { Lobbies } from "../lobby";
import { Director } from "../map/Builders/Director";

export class Usecase {
  private readonly lobbies: Lobbies;
  private readonly pub: Publisher;

  constructor(lobbies: Lobbies, pub: Publisher) {
    this.lobbies = lobbies;
    this.pub = pub;
  }

  start(lobby: Lobby): [boolean, dto.StartRes | null] {
    if (lobby.getPlayers().size < 2 || !lobby.allPlayersReady()) {
      return [false, null];
    }

    const firstMap = Director.CreateMap1(
      Levels[0].createMap().getInitialData()
    );
    const secondMap = Director.CreateMap2(
      Levels[1].createMap().getInitialData()
    );

    const maps = [firstMap, secondMap];

    const game = new Game(lobby.getID(), maps);

    lobby.getPlayers().forEach((player) => {
      player.setLobby(null).setGame(game).setCoords(firstMap.getSpawnPoint());
      lobby.deletePlayer(player);
      game.addPlayer(player);
    });
    this.lobbies.delete(lobby.getID());
    this.pub.publish(Event.PLAYER_LIST_CHANGE, game);

    return [true, Presenter.getStartRes(game, Levels[0])];
  }

  getPlayers(game: Game): dto.GetPlayersRes {
    return Presenter.getPlayersRes(game.getPlayers());
  }

  deletePlayer(player: Player) {
    const game = player.getGame();
    if (game === null) {
      return;
    }
    game.deletePlayer(player);

    this.pub.publish(Event.PLAYER_LIST_CHANGE, game);
  }
}
