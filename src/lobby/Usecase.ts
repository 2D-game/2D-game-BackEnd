import { Event as LobbyEvent, EventBus as LobbyEventBus, Lobby, Presenter } from './'
import { Event as PlayerEvent, EventBus as PlayerEventBus, Player, Usecase as PlayerUsecase } from '../player'
import * as dto from './dto'
import { Session } from '../session'
import { Lobbies } from './Lobbies'

export class Usecase {
	private readonly lobbies: Lobbies
	private readonly playerUcase: PlayerUsecase
	private readonly lobbyEvBus: LobbyEventBus

	constructor(playerUcase: PlayerUsecase, lobbyEvBus: LobbyEventBus, playerEvBus: PlayerEventBus) {
		this.lobbies = new Lobbies()
		this.playerUcase = playerUcase
		this.lobbyEvBus = lobbyEvBus

		playerEvBus.subscribe(PlayerEvent.PLAYER_CREATED, this.onPlayerConnect.bind(this))
		playerEvBus.subscribe(PlayerEvent.PLAYER_DISCONNECTED, this.onPlayerDisconnect.bind(this))
	}

	create(req: dto.CreateReq): [Session, dto.CreateRes] {
		dto.CreateReq.parse(req)

		const lobby = new Lobby()
		this.lobbies.add(lobby)
		const session = this.playerUcase.create(req.username, lobby)

		return [session, {
			id: lobby.getID()
		}]
	}

	join(req: dto.JoinReq): [Session, dto.JoinRes] {
		dto.JoinReq.parse(req)

		const lobby = this.lobbies.get(req.id)
		const session = this.playerUcase.create(req.username, lobby)

		return [session, {
			id: lobby.getID()
		}]
	}

	getPlayers(lobby: Lobby): dto.GetPlayersRes {
		return Presenter.getPlayerRes(lobby.getPlayers())
	}

	onPlayerConnect(player: Player) {
		const lobby = player.getLobby()
		if (lobby === null) {
			return
		}
		lobby.addPlayer(player)

		this.lobbyEvBus.publish(LobbyEvent.PLAYER_LIST_CHANGE, lobby)
	}

	onPlayerDisconnect(player: Player) {
		const lobby = player.getLobby()
		if (lobby === null) {
			return
		}
		lobby.deletePlayer(player)

		if (lobby.playerCount() === 0) {
			this.lobbies.delete(lobby.getID())
		} else {
			this.lobbyEvBus.publish(LobbyEvent.PLAYER_LIST_CHANGE, lobby)
		}
	}
}
