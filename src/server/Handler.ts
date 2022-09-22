import { HandlerFactory as LobbyHandlerFactory } from '../lobby'
import { Server as SocketServer } from 'socket.io'
import { ExtendedSocket } from '../util/Socket'

export class Handler {
	constructor(io: SocketServer, lobbyHndFact: LobbyHandlerFactory) {
		io.on('connection', (socket) => {
			const ext = new ExtendedSocket(socket)
			lobbyHndFact.create(ext)
		})
	}
}
