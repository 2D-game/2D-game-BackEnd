import { ExtendedSocket } from '../util/Socket'
import { Usecase as LobbyUsecase } from './'
import { Usecase as SessionUsecase } from '../session'
import * as dto from './dto'

export class HandlerFactory {
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

export class Handler {
	private readonly socket: ExtendedSocket
	private readonly lobbyUcase: LobbyUsecase
	private readonly sessionUcase: SessionUsecase

	constructor(socket: ExtendedSocket, lobbyUcase: LobbyUsecase, sessionUcase: SessionUsecase) {
		this.socket = socket
		this.lobbyUcase = lobbyUcase
		this.sessionUcase = sessionUcase

		socket.on('create_lobby', this.onCreateLobby)
		socket.on('join_lobby', this.onJoinLobby)
		socket.on('player_list', this.onPlayerList)
		socket.underlying().on('disconnect', this.onDisconnect)
	}

	private onCreateLobby(ev: string, req: dto.CreateLobbyReq) {
		const [ss, res] = this.lobbyUcase.createLobby(req)
		this.sessionUcase.setSession(this.socket, ss)
		this.socket.emit(ev, res)
	}

	private onJoinLobby(ev: string, req: dto.JoinLobbyReq) {
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
