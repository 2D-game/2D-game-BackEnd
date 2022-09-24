import { ExtendedSocket } from '../util/Socket'
import { EventBus, Event, Lobby, Usecase as LobbyUsecase } from './'
import { Session, Usecase as SessionUsecase } from '../session'
import * as dto from './dto'
import { IHandler, IHandlerFactory } from '../server'
import { Server as IOServer } from 'socket.io'
import { Usecase as GameUsecase } from '../game'

const ErrNotInLobby = 'Not in lobby'
const ErrAlreadyInLobbyOrGame = 'Already in lobby or game'

export class HandlerFactory extends IHandlerFactory {
	private readonly io: IOServer
	private readonly lobbyUcase: LobbyUsecase
	private readonly gameUcase: GameUsecase
	private readonly sessionUcase: SessionUsecase
	private readonly evBus: EventBus

	constructor(io: IOServer, lobbyUcase: LobbyUsecase, gameUcase: GameUsecase, sessionUcase: SessionUsecase, evBus: EventBus) {
		super()
		this.io = io
		this.lobbyUcase = lobbyUcase
		this.gameUcase = gameUcase
		this.sessionUcase = sessionUcase
		this.evBus = evBus
	}

	create(socket: ExtendedSocket) {
		return new Handler(socket, this.lobbyUcase, this.sessionUcase)
	}

	registerListeners() {
		this.evBus.subscribe(Event.PLAYER_LIST_CHANGE, this.onPlayerListChange.bind(this))
		this.evBus.subscribe(Event.PLAYER_READINESS_CHANGE, this.onPlayerReadinessChange.bind(this))
	}

	private onPlayerListChange(lobby: Lobby) {
		const res = ExtendedSocket.response(this.lobbyUcase.getPlayers(lobby))
		this.io
			.to(lobby.getID())
			.emit('lobby_player_list', res)
	}

	private onPlayerReadinessChange(lobby: Lobby) {
		const [started, res] = this.gameUcase.start(lobby)
		if (!started || res === null) {
			return
		}

		this.io
			.to(lobby.getID())
			.emit('start_game', ExtendedSocket.response(res))
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
