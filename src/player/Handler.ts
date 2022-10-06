import { IHandler, IHandlerFactory } from '../server'
import { Usecase as PlayerUsecase } from './'
import * as dto from './'
import { Usecase as SessionUsecase } from '../session'
import { ExtendedSocket } from '../util/Socket'
import { Server as IOServer } from 'socket.io'

export class HandlerFactory extends IHandlerFactory {
	private readonly io: IOServer
	private readonly playerUcase: PlayerUsecase
	private readonly sessionUcase: SessionUsecase

	constructor(io: IOServer, playerUcase: PlayerUsecase, sessionUcase: SessionUsecase) {
		super()
		this.io = io
		this.playerUcase = playerUcase
		this.sessionUcase = sessionUcase
	}

	create(socket: ExtendedSocket) {
		return new Handler(this.io, socket, this.playerUcase, this.sessionUcase)
	}
}

export class Handler implements IHandler {
	private readonly io: IOServer
	private readonly socket: ExtendedSocket
	private readonly playerUcase: PlayerUsecase
	private readonly sessionUcase: SessionUsecase

	constructor(io: IOServer, socket: ExtendedSocket, playerUcase: PlayerUsecase, sessionUcase: SessionUsecase) {
		this.io = io
		this.socket = socket
		this.playerUcase = playerUcase
		this.sessionUcase = sessionUcase
	}

	public registerListeners() {
		const socket = this.socket
		socket.on('move', socket.wrapErrHandler(this.onMove.bind(this)))
		socket.on('set_ready', socket.wrapErrHandler(this.onSetReady.bind(this)))
		socket.underlying().on('disconnect', this.onDisconnect.bind(this))
	}

	public onMove(ev: string, req: dto.MoveReq) {
		const s = this.sessionUcase.authGuard(this.socket)
		const player = s.getPlayer()

		const res = this.playerUcase.move(player, req)
		const game = player.getGame()
		if (game === null) {
			return
		}
		this.io
			.to(game.getID())
			.emit(ev, ExtendedSocket.response(res))
	}

	public onSetReady(ev: string) {
		const s = this.sessionUcase.authGuard(this.socket)
		const player = s.getPlayer()

		const res = this.playerUcase.setReady(player)
		const lobby = player.getLobby()
		if (lobby === null) {
			return
		}
		this.io
			.to(lobby.getID())
			.emit(ev, ExtendedSocket.response(res))
	}

	public onDisconnect() {
		const ss = this.sessionUcase.getSession(this.socket)
		if (ss === null) {
			return
		}
		this.playerUcase.disconnect(ss)
	}
}
