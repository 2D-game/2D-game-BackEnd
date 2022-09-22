import { ExtendedSocket } from '../util/Socket'
import { EventBus, Event, Lobby, Usecase as LobbyUsecase } from './'
import { Session, Usecase as SessionUsecase } from '../session'
import * as dto from './dto'
import { IHandler, IHandlerFactory } from '../server'
import { Server as IOServer } from 'socket.io'

const ErrNotInLobby = 'Not in lobby'
const ErrAlreadyInLobby = 'Already in lobby'

function getLobbyRoom(lobby: Lobby) {
	return `lobby:${lobby.getID()}`
}

export class HandlerFactory implements IHandlerFactory {
	private readonly io: IOServer
	private readonly lobbyUcase: LobbyUsecase
	private readonly sessionUcase: SessionUsecase
	private readonly evBus: EventBus

	constructor(io: IOServer, lobbyUcase: LobbyUsecase, sessionUcase: SessionUsecase, evBus: EventBus) {
		this.io = io
		this.lobbyUcase = lobbyUcase
		this.sessionUcase = sessionUcase
		this.evBus = evBus
	}

	create(socket: ExtendedSocket) {
		return new Handler(socket, this.lobbyUcase, this.sessionUcase)
	}

	registerListeners() {
		this.evBus.subscribe(Event.PLAYER_LIST_CHANGE, this.onPlayerListChange.bind(this))
	}

	private onPlayerListChange(lobby: Lobby) {
		const res = ExtendedSocket.response(this.lobbyUcase.getPlayers(lobby))
		this.io
			.to(getLobbyRoom(lobby))
			.emit('player_list', res)
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
	}

	private joinLobby(ev: string, session: Session, res: dto.CreateLobbyRes | dto.JoinLobbyRes) {
		const lobby = session.getPlayer().getLobby()
		if (lobby === null) {
			throw new Error(ErrNotInLobby)
		}

		this.sessionUcase.setSession(this.socket, session)
		this.socket.emit(ev, res)
		this.socket.join(getLobbyRoom(lobby))
	}

	private onCreateLobby(ev: string, req: dto.CreateLobbyReq) {
		this.sessionUcase.notAuthGuard(this.socket, ErrAlreadyInLobby)

		const [ss, res] = this.lobbyUcase.create(req)
		this.joinLobby(ev, ss, res)
	}

	private onJoinLobby(ev: string, req: dto.JoinLobbyReq) {
		this.sessionUcase.notAuthGuard(this.socket, ErrAlreadyInLobby)

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
