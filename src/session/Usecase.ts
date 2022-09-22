import { ExtendedSocket } from '../util/Socket'
import { Session, Repository } from './'

export class Usecase {
	private readonly repo: Repository

	constructor(repo: Repository) {
		this.repo = repo
	}

	setSession(socket: ExtendedSocket, session: Session) {
		socket.underlying().data.sessionID = session.getID()
	}

	getSession(socket: ExtendedSocket): Session | null {
		const id = socket.underlying().data.sessionID
		if (id === undefined) {
			return null
		}
		return this.repo.get(id)
	}
}
