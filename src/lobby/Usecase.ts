import { Repository as LobbyRepository, Lobby } from './'
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
}
