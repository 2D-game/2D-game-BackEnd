import { Session } from './Session'
import { Player } from '../player'
import * as crypto from 'crypto'

const ErrSessionNotFound = 'Session not found'
const ErrSessionAlreadyExists = 'Session already exists'
const ErrPlayerNotFound = 'Player not found'
const ErrPlayerAlreadyExists = 'Player already exists'
const ErrPlayerSessionAlreadyExists = 'Player session already exists'
const ErrPlayerHasSession = 'Player has an active session'

export interface PlayerIndex {
	insertPlayer(player: Player): void
	deletePlayer(player: Player): void
}

class Index {
	private readonly playerSession: Map<Player, Session | null>

	constructor() {
		this.playerSession = new Map()
	}

	insertPlayer(player: Player) {
		if (this.playerSession.has(player)) {
			throw new Error(ErrPlayerAlreadyExists)
		}
		this.playerSession.set(player, null)
	}

	deletePlayer(player: Player) {
		const s = this.playerSession.get(player)
		if (s === undefined) {
			throw new Error(ErrPlayerNotFound)
		}
		if (s !== null) {
			throw new Error(ErrPlayerHasSession)
		}
	}

	insertPlayerSession(session: Session) {
		const player = session.getPlayer()
		const s = this.playerSession.get(player)
		if (s === undefined) {
			throw new Error(ErrPlayerNotFound)
		}
		if (s !== null) {
			throw new Error(ErrPlayerSessionAlreadyExists)
		}
		this.playerSession.set(player, session)
	}

	deletePlayerSession(session: Session) {
		const player = session.getPlayer()
		const s = this.playerSession.get(player)
		if (s === undefined) {
			throw new Error(ErrPlayerNotFound)
		}
		if (s === null) {
			throw new Error(ErrSessionNotFound)
		}
		this.playerSession.delete(session.getPlayer())
	}
}

export class Repository {
	private readonly sessions: Map<string, Session>
	private readonly index: Index

	constructor() {
		this.sessions = new Map()
		this.index = new Index()
	}

	getIndex(): PlayerIndex {
		return this.index
	}

	insert(session: Session) {
		const id = crypto.randomUUID()
		session.setID(id)

		if (this.sessions.has(id)) {
			throw new Error(ErrSessionAlreadyExists)
		}
		this.index.insertPlayerSession(session)
		this.sessions.set(id, session)
	}

	get(id: string): Session {
		const s = this.sessions.get(id)
		if (s === undefined) {
			throw new Error(ErrSessionNotFound)
		}
		return s
	}

	delete(id: string) {
		const s = this.sessions.get(id)
		if (s === undefined) {
			throw new Error(ErrSessionNotFound)
		}
		this.index.deletePlayerSession(s)
		this.sessions.delete(id)
	}
}
