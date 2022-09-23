import { ExtendedSocket } from '../util/Socket'
import { Session } from './'
import { Sessions } from './Sessions'

const ErrForbidden = 'Forbidden'

export class Usecase {
	private readonly sessions: Sessions

	constructor(sessions: Sessions) {
		this.sessions = sessions
	}

	setSession(socket: ExtendedSocket, session: Session) {
		socket.underlying().data.sessionID = session.getID()
	}

	getSession(socket: ExtendedSocket): Session | null {
		const id = socket.underlying().data.sessionID
		if (id === undefined) {
			return null
		}
		return this.sessions.get(id)
	}

	authGuard(socket: ExtendedSocket, errMessage: string = ErrForbidden): Session {
		const session = this.getSession(socket)
		if (session === null) {
			throw new Error(errMessage)
		}
		return session
	}

	notAuthGuard(socket: ExtendedSocket, errMessage: string = ErrForbidden) {
		const session = this.getSession(socket)
		if (session !== null) {
			throw new Error(errMessage)
		}
	}
}
