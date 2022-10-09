import { Server as SocketServer } from 'socket.io'
import { ExtendedSocket } from '../util/Socket'

export abstract class IHandlerFactory {
	abstract create(socket: ExtendedSocket): IHandler
	registerListeners(socket: ExtendedSocket) {
		const handler = this.create(socket)
		handler.registerListeners()
	}
}

export interface IHandler {
	registerListeners(): void
}

export class Server {
	private readonly io: SocketServer
	private factories: IHandlerFactory[]

	constructor(io: SocketServer) {
		this.io = io
		this.factories = []
	}

	addHandlerFactory(factory: IHandlerFactory): this {
		this.factories.push(factory)
		return this
	}

	registerListeners() {
		this.io.on('connection', (socket) => {
			const ext = new ExtendedSocket(socket)
			this.factories.forEach((factory) => factory.registerListeners(ext))
		})
	}
}
