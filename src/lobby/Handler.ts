import { ExtendedSocket } from '../util/Socket'
import { Usecase as LobbyUsecase } from './'
import { Usecase as SessionUsecase } from '../session'
import * as dto from './dto'
import { IHandler, IHandlerFactory } from '../server'

const ErrAlreadyInLobby = 'Already in lobby'

export class HandlerFactory implements IHandlerFactory {
	private readonly lobbyUsecase: LobbyUsecase
	private readonly sessionUsecase: SessionUsecase

	constructor(lobbyUsecase: LobbyUsecase, sessionUsecase: SessionUsecase) {
		this.lobbyUsecase = lobbyUsecase
		this.sessionUsecase = sessionUsecase
	}

	create(socket: ExtendedSocket) {
		return new Handler(socket, this.lobbyUsecase, this.sessionUsecase)
	}
}

export class Handler implements IHandler {
	private readonly socket: ExtendedSocket
	private readonly lobbyUcase: LobbyUsecase
	private readonly sessionUcase: SessionUsecase

	constructor(socket: ExtendedSocket, lobbyUcase: LobbyUsecase, sessionUcase: SessionUsecase) {
		this.socket = socket
		this.lobbyUcase = lobbyUcase
		this.sessionUcase = sessionUcase
	}

	public registerListeners() {
		const socket = this.socket
		socket.on('create_lobby', socket.wrapErrHandler(this.onCreateLobby.bind(this)))
		socket.on('join_lobby', socket.wrapErrHandler(this.onJoinLobby.bind(this)))
		socket.on('player_list', socket.wrapErrHandler(this.onPlayerList.bind(this)))
		socket.underlying().on('disconnect', socket.wrapErrHandler(this.onDisconnect.bind(this)))
	}

	private onCreateLobby(ev: string, req: dto.CreateLobbyReq) {
		this.sessionUcase.notAuthGuard(this.socket, ErrAlreadyInLobby)

		const [ss, res] = this.lobbyUcase.createLobby(req)
		this.sessionUcase.setSession(this.socket, ss)
		this.socket.emit(ev, res)
	}

	private onJoinLobby(ev: string, req: dto.JoinLobbyReq) {
		this.sessionUcase.notAuthGuard(this.socket, ErrAlreadyInLobby)

		const [ss, res] = this.lobbyUcase.joinLobby(req)
		this.sessionUcase.setSession(this.socket, ss)
		this.socket.emit(ev, res)
	}

	private onPlayerList(ev: string) {
		const ss = this.sessionUcase.getSession(this.socket)
		if (ss === null) {
			return
		}
		const res = this.lobbyUcase.getPlayers(ss.getPlayer())
		this.socket.emit(ev, res)
	}

	public onDisconnect() {
		const ss = this.sessionUcase.getSession(this.socket)
		if (ss === null) {
			return
		}
		this.lobbyUcase.disconnect(ss)
	}
}
