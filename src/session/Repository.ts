import { Session } from './Session'
import { Player } from '../player'
import * as crypto from 'crypto'
import { IIndex } from '../repository'

const ErrSessionNotFound = 'Session not found'
const ErrSessionAlreadyExists = 'Session already exists'
const ErrPlayerNotFound = 'Player not found'
const ErrPlayerAlreadyExists = 'Player already exists'
const ErrPlayerSessionAlreadyExists = 'Player session already exists'
const ErrPlayerHasSession = 'Player has an active session'

class PlayerIndexAdapter implements IIndex<Player> {
	private readonly index: Index

	constructor(index: Index) {
		this.index = index
	}

	insert(player: Player) {
		this.index.insertPlayer(player)
	}

	delete(player: Player) {
		this.index.deletePlayer(player)
	}

	update(oldPlayer: Player, newPlayer: Player) {
		this.index.updatePlayer(oldPlayer, newPlayer)
	}
}

class Index {
	private readonly sessions: Map<string, Session>
	private readonly playerSession: Map<Player, Session | null>

	constructor() {
		this.sessions = new Map()
		this.playerSession = new Map()
	}

	insertSession(session: Session) {
		const id = session.getID()
		if (this.sessions.has(id)) {
			throw new Error(ErrSessionAlreadyExists)
		}
		this.insertPlayerSession(session)
		this.sessions.set(id, session)
	}

	getSession(id: string) {
		const s = this.sessions.get(id)
		if (s === undefined) {
			throw new Error(ErrSessionNotFound)
		}
		return s
	}

	deleteSession(id: string) {
		const s = this.sessions.get(id)
		if (s === undefined) {
			throw new Error(ErrSessionNotFound)
		}
		this.deletePlayerSession(s)
		this.sessions.delete(id)
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

	updatePlayer(oldPlayer: Player, newPlayer: Player) {
		if (this.playerSession.has(newPlayer)) {
			throw new Error(ErrPlayerAlreadyExists)
		}

		const s = this.playerSession.get(oldPlayer)
		if (s === undefined) {
			throw new Error(ErrPlayerNotFound)
		}

		this.playerSession.delete(oldPlayer)
		this.playerSession.set(newPlayer, s)
	}

	private insertPlayerSession(session: Session) {
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

	private deletePlayerSession(session: Session) {
		const player = session.getPlayer()
		const s = this.playerSession.get(player)
		if (s === undefined) {
			throw new Error(ErrPlayerNotFound)
		}
		if (s === null) {
			throw new Error(ErrSessionNotFound)
		}
		this.playerSession.set(session.getPlayer(), null)
	}
}

export class Repository {
	private readonly index: Index

	constructor() {
		this.index = new Index()
	}

	getPlayerIndex(): PlayerIndexAdapter {
		return new PlayerIndexAdapter(this.index)
	}

	insert(session: Session) {
		const id = crypto.randomUUID()
		session.setID(id)
		this.index.insertSession(session)
	}

	get(id: string): Session {
		return this.index.getSession(id)
	}

	delete(id: string) {
		return this.index.deleteSession(id)
	}
}
