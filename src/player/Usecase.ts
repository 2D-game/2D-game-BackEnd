import { Repository as PlayerRepository, Player, Event, EventBus } from '../player'
import { Repository as SessionRepository, Session } from '../session'
import { Lobby } from '../lobby'

export class Usecase {
	private readonly playerRepo: PlayerRepository
	private readonly sessionRepo: SessionRepository
	private readonly evBus: EventBus

	constructor(playerRepo: PlayerRepository, sessionRepo: SessionRepository, evBus: EventBus) {
		this.playerRepo = playerRepo
		this.sessionRepo = sessionRepo
		this.evBus = evBus
	}

	create(username: string, lobby: Lobby): Session {
		const player = new Player(username, lobby)
		this.playerRepo.insert(player)

		const session = new Session(player)
		this.sessionRepo.insert(session)

		this.evBus.publish(Event.PLAYER_CREATED, player)
		return session
	}

	disconnect(session: Session) {
		this.sessionRepo.delete(session.getID())
		const player = session.getPlayer()
		this.playerRepo.delete(player.getID())
		this.evBus.publish(Event.PLAYER_DISCONNECTED, player)
	}
}
