import { ExtendedSocket } from '../util/Socket'
import { Usecase as GameUsecase } from './'
import { Usecase as SessionUsecase } from '../session'
import { IHandler, IHandlerFactory } from '../server'

const ErrNotInGame = 'Not in game'

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
		socket.on('game_player_list', socket.wrapErrHandler(this.onPlayerList.bind(this)))
	}

	private onPlayerList(ev: string) {
		const s = this.sessionUcase.authGuard(this.socket)
		const game = s.getPlayer().getGame()
		if (game === null) {
			throw new Error(ErrNotInGame)
		}

		const res = this.gameUcase.getPlayers(game)
		this.socket.emit(ev, res)
	}
}
