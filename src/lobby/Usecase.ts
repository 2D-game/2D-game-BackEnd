import { Repository as LobbyRepository, Lobby, Presenter } from './'
import { Repository as PlayerRepository, Player } from '../player'
import { Repository as SessionRepository, Session } from '../session'
import * as dto from './dto'

export class Usecase {
	private readonly lobbyRepo: LobbyRepository
	private readonly playerRepo: PlayerRepository
	private readonly sessionRepo: SessionRepository

	constructor(lobbyRepo: LobbyRepository, playerRepo: PlayerRepository, sessionRepo: SessionRepository) {
		this.lobbyRepo = lobbyRepo
		this.playerRepo = playerRepo
		this.sessionRepo = sessionRepo
	}

	createLobby(req: dto.CreateLobbyReq): [Session, dto.CreateLobbyRes] {
		dto.CreateLobbyReq.parse(req)

		const lobby = new Lobby()
		this.lobbyRepo.insert(lobby)

		const player = new Player(req.username, lobby)
		this.playerRepo.insert(player)

		const session = new Session(player)
		this.sessionRepo.insert(session)

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

		return [session, {
			id: lobby.getID()
		}]
	}

	getPlayers(player: Player): dto.GetPlayersRes {
		const players = this.lobbyRepo.getPlayers(player.getLobby().getID())
		return Presenter.getPlayerRes(players)
	}

	disconnect(session: Session) {
		this.sessionRepo.delete(session.getID())
		this.playerRepo.delete(session.getPlayer().getID())
	}
}
