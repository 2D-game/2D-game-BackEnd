import { Session } from './Session'

const ErrSessionNotFound = 'Session not found'
const ErrSessionAlreadyExists = 'Session already exists'

export class Sessions {
	private readonly sessions: Map<string, Session>

	constructor() {
		this.sessions = new Map()
	}

	add(session: Session): void {
		if (this.sessions.has(session.getID())) {
			throw new Error(ErrSessionAlreadyExists)
		}
		this.sessions.set(session.getID(), session)
	}

	get(id: string): Session {
		const s = this.sessions.get(id)
		if (s === undefined) {
			throw new Error(ErrSessionNotFound)
		}
		return s
	}

	delete(id: string): void {
		if (!this.sessions.delete(id)) {
			throw new Error(ErrSessionNotFound)
		}
	}
}
