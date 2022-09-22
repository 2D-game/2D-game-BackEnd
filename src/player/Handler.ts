import { IHandler, IHandlerFactory } from '../server'
import { EventBus, Usecase as PlayerUsecase } from './'
import { Usecase as SessionUsecase } from '../session'
import { ExtendedSocket } from '../util/Socket'

export class HandlerFactory extends IHandlerFactory {
	private readonly playerUcase: PlayerUsecase
	private readonly sessionUcase: SessionUsecase
	private readonly evBus: EventBus

	constructor(playerUcase: PlayerUsecase, sessionUcase: SessionUsecase, evBus: EventBus) {
		super()
		this.playerUcase = playerUcase
		this.sessionUcase = sessionUcase
		this.evBus = evBus
	}

	create(socket: ExtendedSocket) {
		return new Handler(socket, this.playerUcase, this.sessionUcase)
	}
}

export class Handler implements IHandler {
	private readonly socket: ExtendedSocket
	private readonly playerUcase: PlayerUsecase
	private readonly sessionUcase: SessionUsecase

	constructor(socket: ExtendedSocket, playerUcase: PlayerUsecase, sessionUcase: SessionUsecase) {
		this.socket = socket
		this.playerUcase = playerUcase
		this.sessionUcase = sessionUcase
	}

	public registerListeners() {
		this.socket.underlying().on('disconnect', this.onDisconnect.bind(this))
	}

	public onDisconnect() {
		const ss = this.sessionUcase.getSession(this.socket)
		if (ss === null) {
			return
		}
		this.playerUcase.disconnect(ss)
	}
}
