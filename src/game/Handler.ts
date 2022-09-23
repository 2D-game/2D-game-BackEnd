import { ExtendedSocket } from '../util/Socket'
import { Event, EventBus, Game, Usecase as GameUsecase } from './'
import { Usecase as SessionUsecase } from '../session'
import { IHandler, IHandlerFactory } from '../server'
import { Server as IOServer } from 'socket.io'

const ErrNotInLobby = 'Not in lobby'
const ErrNotInGame = 'Not in game'
const ErrAlreadyInGame = 'Already in game'

export class HandlerFactory extends IHandlerFactory {
	private readonly io: IOServer
	private readonly gameUcase: GameUsecase
	private readonly sessionUcase: SessionUsecase
	private readonly evBus: EventBus

	constructor(io: IOServer, gameUcase: GameUsecase, sessionUcase: SessionUsecase, evBus: EventBus) {
		super()
		this.io = io
		this.gameUcase = gameUcase
		this.sessionUcase = sessionUcase
		this.evBus = evBus
	}

	create(socket: ExtendedSocket) {
		return new Handler(this.io, socket, this.gameUcase, this.sessionUcase)
	}

	registerListeners() {
		this.evBus.subscribe(Event.PLAYER_LIST_CHANGE, this.onPlayerListChange.bind(this))
	}

	private onPlayerListChange(game: Game) {
		const res = ExtendedSocket.response(this.gameUcase.getPlayers(game))
		this.io
			.to(game.getID())
			.emit('game_player_list', res)
	}
}

export class Handler implements IHandler {
	private readonly io: IOServer
	private readonly socket: ExtendedSocket
	private readonly gameUcase: GameUsecase
	private readonly sessionUcase: SessionUsecase

	constructor(io: IOServer, socket: ExtendedSocket, gameUcase: GameUsecase, sessionUcase: SessionUsecase) {
		this.io = io
		this.socket = socket
		this.gameUcase = gameUcase
		this.sessionUcase = sessionUcase
	}

	public registerListeners() {
		const socket = this.socket
		socket.on('start_game', socket.wrapErrHandler(this.onStartGame.bind(this)))
		socket.on('game_player_list', socket.wrapErrHandler(this.onPlayerList.bind(this)))
	}

	private onStartGame(ev: string) {
		const s = this.sessionUcase.authGuard(this.socket, ErrNotInLobby)
		const lobby = s.getPlayer().getLobby()
		if (lobby === null) {
			throw new Error(ErrNotInLobby)
		}
		if (s.getPlayer().getGame() !== null) {
			throw new Error(ErrAlreadyInGame)
		}

		const res = this.gameUcase.start(lobby)
		this.io
			.to(lobby.getID())
			.emit(ev, res)
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
