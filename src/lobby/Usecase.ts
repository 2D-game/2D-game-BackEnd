import { Repository as LobbyRepository, Lobby, Presenter } from './'
import { Repository as PlayerRepository, Player } from '../player'
import { Repository as SessionRepository, Session } from '../session'
import * as dto from './dto'
import { Event, EventBus } from './EventBus'

export class Usecase {
	private readonly lobbyRepo: LobbyRepository
	private readonly playerRepo: PlayerRepository
	private readonly sessionRepo: SessionRepository
	private readonly evBus: EventBus

	constructor(lobbyRepo: LobbyRepository, playerRepo: PlayerRepository, sessionRepo: SessionRepository, evBus: EventBus) {
		this.lobbyRepo = lobbyRepo
		this.playerRepo = playerRepo
		this.sessionRepo = sessionRepo
		this.evBus = evBus
	}

	createLobby(req: dto.CreateLobbyReq): [Session, dto.CreateLobbyRes] {
		dto.CreateLobbyReq.parse(req)

		const lobby = new Lobby()
		this.lobbyRepo.insert(lobby)

		const player = new Player(req.username, lobby)
		this.playerRepo.insert(player)

		const session = new Session(player)
		this.sessionRepo.insert(session)

		this.evBus.publish(Event.NEW_PLAYER, lobby)
		return [session, {
			id: lobby.getID(),
		}]
	}

	joinLobby(req: dto.JoinLobbyReq): [Session, dto.JoinLobbyRes] {
		dto.JoinLobbyReq.parse(req)

		const lobby = this.lobbyRepo.get(req.id)

		const player = new Player(req.username, lobby)
		this.playerRepo.insert(player)

		const session = new Session(player)
		this.sessionRepo.insert(session)

		this.evBus.publish(Event.NEW_PLAYER, lobby)
		return [session, {
			id: lobby.getID()
		}]
	}

	getPlayers(lobby: Lobby): dto.GetPlayersRes {
		const players = this.lobbyRepo.getPlayers(lobby.getID())
		return Presenter.getPlayerRes(players)
	}

	disconnect(session: Session) {
		this.sessionRepo.delete(session.getID())
		this.playerRepo.delete(session.getPlayer().getID())

		const lobby = session.getPlayer().getLobby()
		if (this.lobbyRepo.playersCount(lobby.getID()) === 0) {
			this.lobbyRepo.delete(lobby.getID())
		} else {
			this.evBus.publish(Event.DISCONNECTED_PLAYER, lobby)
		}
	}
}
