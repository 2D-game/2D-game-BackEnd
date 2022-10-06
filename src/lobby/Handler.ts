import { ExtendedSocket } from '../util/Socket'
import { Usecase as LobbyUsecase } from './'
import { Session, Usecase as SessionUsecase } from '../session'
import * as dto from './dto'
import { IHandler, IHandlerFactory } from '../server'

const ErrNotInLobby = 'Not in lobby'
const ErrAlreadyInLobbyOrGame = 'Already in lobby or game'

export class HandlerFactory extends IHandlerFactory {
	private readonly lobbyUcase: LobbyUsecase
	private readonly sessionUcase: SessionUsecase

	constructor(lobbyUcase: LobbyUsecase, sessionUcase: SessionUsecase) {
		super()
		this.lobbyUcase = lobbyUcase
		this.sessionUcase = sessionUcase
	}

	create(socket: ExtendedSocket) {
		return new Handler(socket, this.lobbyUcase, this.sessionUcase)
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
		socket.on('lobby_player_list', socket.wrapErrHandler(this.onPlayerList.bind(this)))
	}

	private joinLobby(ev: string, session: Session, res: dto.CreateRes | dto.JoinRes) {
		const lobby = session.getPlayer().getLobby()
		if (lobby === null) {
			throw new Error(ErrNotInLobby)
		}

		this.sessionUcase.setSession(this.socket, session)
		this.socket.emit(ev, res)
		this.socket.join(lobby.getID())
	}

	private onCreateLobby(ev: string, req: dto.CreateReq) {
		this.sessionUcase.notAuthGuard(this.socket, ErrAlreadyInLobbyOrGame)

		const [ss, res] = this.lobbyUcase.create(req)
		this.joinLobby(ev, ss, res)
	}

	private onJoinLobby(ev: string, req: dto.JoinReq) {
		this.sessionUcase.notAuthGuard(this.socket, ErrAlreadyInLobbyOrGame)

		const [ss, res] = this.lobbyUcase.join(req)
		this.joinLobby(ev, ss, res)
	}

	private onPlayerList(ev: string) {
		const s = this.sessionUcase.authGuard(this.socket)
		const lobby = s.getPlayer().getLobby()
		if (lobby === null) {
			throw new Error(ErrNotInLobby)
		}

		const res = this.lobbyUcase.getPlayers(lobby)
		this.socket.emit(ev, res)
	}
}
