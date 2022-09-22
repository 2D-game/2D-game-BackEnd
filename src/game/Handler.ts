import { ExtendedSocket } from '../util/Socket'
import { Usecase as GameUsecase } from './'
import { Usecase as SessionUsecase } from '../session'
import { IHandler, IHandlerFactory } from '../server'

const ErrNotInLobby = 'Not in lobby'

export class HandlerFactory extends IHandlerFactory {
	private readonly gameUcase: GameUsecase
	private readonly sessionUcase: SessionUsecase

	constructor(gameUcase: GameUsecase, sessionUcase: SessionUsecase) {
		super()
		this.gameUcase = gameUcase
		this.sessionUcase = sessionUcase
	}

	create(socket: ExtendedSocket) {
		return new Handler(socket, this.gameUcase, this.sessionUcase)
	}
}

export class Handler implements IHandler {
	private readonly socket: ExtendedSocket
	private readonly gameUcase: GameUsecase
	private readonly sessionUcase: SessionUsecase

	constructor(socket: ExtendedSocket, gameUcase: GameUsecase, sessionUcase: SessionUsecase) {
		this.socket = socket
		this.gameUcase = gameUcase
		this.sessionUcase = sessionUcase
	}

	public registerListeners() {
		const socket = this.socket
		socket.on('start_game', socket.wrapErrHandler(this.onGameStart.bind(this)))
	}

	private onGameStart(ev: string) {
		const s = this.sessionUcase.authGuard(this.socket, ErrNotInLobby)
		const lobby = s.getPlayer().getLobby()
		if (lobby === null) {
			throw new Error(ErrNotInLobby)
		}

		const res = this.gameUcase.start(lobby)
		this.socket.emit(ev, res)
	}
}
