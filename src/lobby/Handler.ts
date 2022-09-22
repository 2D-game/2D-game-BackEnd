import { ExtendedSocket } from '../util/Socket'
import { Lobby, Usecase as LobbyUsecase } from './'
import { Session, Usecase as SessionUsecase } from '../session'
import * as dto from './dto'
import { IHandler, IHandlerFactory } from '../server'
import { Event, EventBus } from './EventBus'
import { Server as IOServer } from 'socket.io'

const ErrAlreadyInLobby = 'Already in lobby'

function getLobbyRoom(lobby: Lobby) {
	return `lobby:${lobby.getID()}`
}

export class HandlerFactory implements IHandlerFactory, IHandler {
	private readonly io: IOServer
	private readonly lobbyUcase: LobbyUsecase
	private readonly sessionUcase: SessionUsecase
	private readonly evBus: EventBus

	constructor(io: IOServer, lobbyUcase: LobbyUsecase, sessionUcase: SessionUsecase, evBus: EventBus) {
		this.io = io
		this.evBus = evBus
		this.lobbyUcase = lobbyUcase
		this.sessionUcase = sessionUcase
	}

	create(socket: ExtendedSocket) {
		return new Handler(this.io, socket, this.lobbyUcase, this.sessionUcase)
	}

	registerListeners() {
		this.evBus.subscribe(Event.NEW_PLAYER, this.onNewPlayer.bind(this))
	}

	private onNewPlayer(lobby: Lobby) {
		this.io
			.to(getLobbyRoom(lobby))
			.emit('player_list', this.lobbyUcase.getPlayers(lobby))
	}
}

export class Handler implements IHandler {
	private readonly io: IOServer
	private readonly socket: ExtendedSocket
	private readonly lobbyUcase: LobbyUsecase
	private readonly sessionUcase: SessionUsecase

	constructor(io: IOServer, socket: ExtendedSocket, lobbyUcase: LobbyUsecase, sessionUcase: SessionUsecase) {
		this.io = io
		this.socket = socket
		this.lobbyUcase = lobbyUcase
		this.sessionUcase = sessionUcase
	}

	public registerListeners() {
		const socket = this.socket
		socket.on('create_lobby', socket.wrapErrHandler(this.onCreateLobby.bind(this)))
		socket.on('join_lobby', socket.wrapErrHandler(this.onJoinLobby.bind(this)))
		socket.on('player_list', socket.wrapErrHandler(this.onPlayerList.bind(this)))

		socket.underlying().on('disconnect', this.onDisconnect.bind(this))
	}

	private joinLobby(ev: string, session: Session, res: dto.CreateLobbyRes | dto.JoinLobbyRes) {
		this.sessionUcase.setSession(this.socket, session)
		this.socket.emit(ev, res)
		this.socket.join(getLobbyRoom(session.getPlayer().getLobby()))
	}

	private onCreateLobby(ev: string, req: dto.CreateLobbyReq) {
		this.sessionUcase.notAuthGuard(this.socket, ErrAlreadyInLobby)

		const [ss, res] = this.lobbyUcase.createLobby(req)
		this.joinLobby(ev, ss, res)
	}

	private onJoinLobby(ev: string, req: dto.JoinLobbyReq) {
		this.sessionUcase.notAuthGuard(this.socket, ErrAlreadyInLobby)

		const [ss, res] = this.lobbyUcase.joinLobby(req)
		this.joinLobby(ev, ss, res)
	}

	private onPlayerList(ev: string) {
		const s = this.sessionUcase.authGuard(this.socket)

		const res = this.lobbyUcase.getPlayers(s.getPlayer().getLobby())
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
