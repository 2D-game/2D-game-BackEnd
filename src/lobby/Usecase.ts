import { Repository as LobbyRepository, Lobby, Presenter, Event as LobbyEvent, EventBus as LobbyEventBus } from './'
import { Player, Usecase as PlayerUsecase } from '../player'
import { Repository as SessionRepository, Session } from '../session'
import * as dto from './dto'
import { Event as PlayerEvent , EventBus as PlayerEventBus } from '../player'

export class Usecase {
	private readonly lobbyRepo: LobbyRepository
	private readonly playerUcase: PlayerUsecase
	private readonly sessionRepo: SessionRepository
	private readonly lobbyEvBus: LobbyEventBus
	private readonly playerEvBus: PlayerEventBus

	constructor(lobbyRepo: LobbyRepository, playerUcase: PlayerUsecase, sessionRepo: SessionRepository, lobbyEvBus: LobbyEventBus, playerEvBus: PlayerEventBus) {
		this.lobbyRepo = lobbyRepo
		this.playerUcase = playerUcase
		this.sessionRepo = sessionRepo
		this.lobbyEvBus = lobbyEvBus
		this.playerEvBus = playerEvBus

		playerEvBus.subscribe(PlayerEvent.PLAYER_CREATED, this.onPlayerConnect.bind(this))
		playerEvBus.subscribe(PlayerEvent.PLAYER_DISCONNECTED, this.onPlayerDisconnect.bind(this))
	}

	createLobby(req: dto.CreateLobbyReq): [Session, dto.CreateLobbyRes] {
		dto.CreateLobbyReq.parse(req)

		const lobby = new Lobby()
		this.lobbyRepo.insert(lobby)

		const session = this.playerUcase.create(req.username, lobby)
		return [session, {
			id: lobby.getID(),
		}]
	}

	joinLobby(req: dto.JoinLobbyReq): [Session, dto.JoinLobbyRes] {
		dto.JoinLobbyReq.parse(req)

		const lobby = this.lobbyRepo.get(req.id)

		const session = this.playerUcase.create(req.username, lobby)
		return [session, {
			id: lobby.getID()
		}]
	}

	getPlayers(lobby: Lobby): dto.GetPlayersRes {
		const players = this.lobbyRepo.getPlayers(lobby.getID())
		return Presenter.getPlayerRes(players)
	}

	onPlayerConnect(player: Player) {
		const lobby = player.getLobby()
		if (lobby === null) {
			return
		}

		this.lobbyEvBus.publish(LobbyEvent.PLAYER_LIST_CHANGE, lobby)
	}

	onPlayerDisconnect(player: Player) {
		const lobby = player.getLobby()
		if (lobby === null) {
			return
		}

		if (this.lobbyRepo.playersCount(lobby.getID()) === 0) {
			this.lobbyRepo.delete(lobby.getID())
		} else {
			this.lobbyEvBus.publish(LobbyEvent.PLAYER_LIST_CHANGE, lobby)
		}
	}
}
